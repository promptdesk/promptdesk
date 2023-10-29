import { Organization } from "../models/allModels";
import cookieParser from 'cookie-parser';
var organization_db = new Organization();

const apiKeyMiddleware = async function(req:any, res:any, next:any) {

    const token = req.headers.authorization;
    const key = token && token.split(' ')[1];

    const organization = req.headers.organization;

    if (!token) {
        res.status(401).json({ error: 'Missing Authorization Header' });
        return;
    }

    let db_organization = null;

    //if local, find the only organization in the database
    if (process.env.HOSTING == 'local' && organization == undefined && key == process.env.API_KEY) {

        db_organization = await organization_db.getOrganization();

    } else {

        db_organization = await organization_db.getOrganizationByKey(key, organization);

    }

    if (db_organization == null) {
        res.status(401).json({ error: 'Invalid API Authorization' });
        return;
    }

    const organization_data = {
        name: db_organization.name,
        id: db_organization.id,
    }

    req.organization = organization_data;
  
    next();

}

//to be used for self-hosted frontend - should be harddened for security
const frontendAuthMiddleware = async function(req:any, res:any, next:any) {

    const auth = {login: process.env.USERNAME, password: process.env.API_KEY} // change this

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password && process.env.HOSTING == 'local') {
        let db_organization = await organization_db.getOrganization();
        let token = db_organization.keys[0].key;
        res.cookie('token', token, { maxAge: 900000, httpOnly: false });
        res.cookie('organization', db_organization.id, { maxAge: 900000, httpOnly: false });
        return next()
    }

    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message

}

export { apiKeyMiddleware, frontendAuthMiddleware }