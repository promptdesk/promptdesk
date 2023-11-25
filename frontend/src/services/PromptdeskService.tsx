import Cookies from 'js-cookie';
import axios from 'axios';

const fetchFromPromptdesk = async (path: string, method: string = 'GET', body?: any) => {

    //read auth token from local storage if it exists
    let token = undefined;
    let organization = undefined;
    if (typeof window !== 'undefined') {

        token = Cookies.get('token');
        organization = Cookies.get('organization');

    }

    if(!token && process.env.ORGANIZATION_API_KEY) {
        token = process.env.ORGANIZATION_API_KEY;
    }

    try {

        let url = ""
        //check if process.env.PROMPT_SERVER_URL is set
        if(process.env.PROMPT_SERVER_URL) {
            url = process.env.PROMPT_SERVER_URL;
        }

        const endpoint = `${url}${path}`;

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`Error with ${method} request to ${endpoint}`);
        }

        return await response.json();

    } catch (error) {

        console.error('API Call Error:', error);
        throw error;

    }

};

const testFromPromptdesk = async (path: string, method: string = 'GET', body?: any) => {

        //read auth token from local storage if it exists
        let token = undefined;
        let organization = undefined;
        if (typeof window !== 'undefined') {
    
            token = Cookies.get('token');
            organization = Cookies.get('organization');
    
        }
    
        if(!token && process.env.ORGANIZATION_API_KEY) {
            token = process.env.ORGANIZATION_API_KEY;
        }
    
        try {
    
            let url = ""
            //check if process.env.PROMPT_SERVER_URL is set
            if(process.env.PROMPT_SERVER_URL) {
                url = process.env.PROMPT_SERVER_URL;
            }
    
            const endpoint = `${url}${path}`;

            var response = await axios({
                url: endpoint,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                data: body ? JSON.stringify(body) : undefined
            })

            if (!response) {
                throw new Error(`Error with ${method} request to ${endpoint}`);
            }

            return response;


        } catch (error) {

            throw error;
    
        }

}

export { fetchFromPromptdesk, testFromPromptdesk };