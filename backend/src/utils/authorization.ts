import { Organization } from "../models/allModels";
var organization_db = new Organization();

const apiKeyMiddleware = async function (req: any, res: any, next: any) {
  const token = req.headers.authorization;

  if (!token) {
    res
      .status(401)
      .json({ error: true, message: "Missing Authorization Header" });
    return;
  }

  const key = token && token.split(" ")[1];

  const organization = req.headers.organization;

  let db_organization = await organization_db.getOrganizationByKey(
    key,
    organization,
  );

  if (db_organization == null) {
    res.status(401).json({ error: true, message: "Invalid API Authorization" });
    return;
  }

  const organization_data = {
    name: db_organization.name,
    id: db_organization.id,
  };

  req.organization = organization_data;

  next();
};

const randomPassword = (length: number = 8) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!#$%^&*()";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export { apiKeyMiddleware, randomPassword };
