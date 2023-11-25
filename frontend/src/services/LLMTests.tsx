import axios from 'axios';
import { fetchFromPromptdesk, testFromPromptdesk } from './PromptdeskService';
import Handlebars from "handlebars";
import Cookies from 'js-cookie';

const testAPI = async (data:object) => {

    var endpoint = '/api/magic/test/endpoint';
    if((data as any).input_format) {
        endpoint = '/api/magic/test/inputformat';
    }
    
    try {

        var response = await testFromPromptdesk(endpoint, 'POST', data);
        return response.data;

    } catch (error:any) {
            
        return error.response.data;

    }

}

export { testAPI };