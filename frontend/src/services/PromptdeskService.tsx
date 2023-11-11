import Cookies from 'js-cookie';

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

        const endpoint = `${process.env.PROMPT_SERVER_URL}${path}`;

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

export { fetchFromPromptdesk };