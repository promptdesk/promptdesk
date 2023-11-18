import mongoose from "mongoose";
import crypto from "crypto";

const organizationSchema = mongoose.model(
  'Organization',
  new mongoose.Schema({
    name: String,
    keys: [{
        key: String,
        description: String
    }]
}, {
    timestamps: true
})
);

class Organization {

  async addOrganization(organization_api_key:any): Promise<any> {
    // Generate a random name for the organization
    const randomName = `org-${crypto.randomBytes(6).toString('hex')}`;
    let randomApiKey = crypto.randomBytes(16+8).toString('hex');
    if(organization_api_key) {
      randomApiKey = organization_api_key;
    }

    // Create a new organization with the generated name
    const organization = new organizationSchema({
      name: randomName,
      keys: [
        {
          key: randomApiKey,
          description: "Default API Key"
        }
      ]
    });

    await organization.save();

    return organization;
  }

  //should only be used in self-hosted mode
  async getOrganization(): Promise<any> {
    let organization:any = await organizationSchema.find();

    if (organization.length == 0) {
      return null;
    }

    organization = organization[0];

    return organization ? this.transformOrganization(organization) : null;
  }

  //should only be used in self-hosted mode
  async getOrganizationById(id:string): Promise<any> {
    try {
      let organization:any = await organizationSchema.findOne({_id: id});
      return organization ? this.transformOrganization(organization) : null;
    } catch (error) {
      return null;
    }
  }

  async getOrganizationByKey(key:string, name:string): Promise<any> {

    let query:any = {
        keys: {
            $elemMatch: {
                key: key
            }
        }
    };

    if (name) {
        query.name = name;
    }
    
    const organization = await organizationSchema.findOne(query);
    return organization ? this.transformOrganization(organization) : null;
  }

  async removeOrganization(id: string): Promise<string> {
    await organizationSchema.findByIdAndDelete(id);
    return id;
  }

  async rotateApiKey(id: string): Promise<string> {
    const randomApiKey = crypto.randomBytes(16).toString('hex');
    await organizationSchema.findByIdAndUpdate(id, {
      api_key: randomApiKey
    });
    return randomApiKey;
  }

  transformOrganization(organization:any) {
    const transformedOrganization = organization.toObject();
    transformedOrganization.id = transformedOrganization._id.toString();
    delete transformedOrganization._id;
    return transformedOrganization;
  }

}

export { Organization, organizationSchema };