import Cookies from 'js-cookie';
import axios from 'axios';

const fetchFromPromptdesk = async (path: string, method: string = 'GET', body?: any) => {

    //read auth token from local storage if it exists
    let token = undefined;
    if (typeof window !== 'undefined') {

        token = Cookies.get('token');

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

        const endpoint = `${url}/api${path}`;

        var response = await axios({
            url: endpoint,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: body ? JSON.stringify(body) : undefined
        })
        return response.data;

    } catch (error) {

        alert("Something went wrong. Please try again later.");

    }

};

const testFromPromptdesk = async (path: string, method: string = 'GET', body?: any) => {

        //read auth token from local storage if it exists
        let token = undefined;
        if (typeof window !== 'undefined') {
    
            token = Cookies.get('token');
    
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