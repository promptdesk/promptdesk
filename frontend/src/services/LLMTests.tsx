import axios from 'axios';
import { fetchFromPromptdesk } from './PromptdeskService';
import Handlebars from "handlebars";

const testAPI = async (axios_object:object) => {

    const variables = await fetchFromPromptdesk('/api/variables');
    const result = variables.reduce((acc:any, item:any) => {
        acc[item.name] = item.value;
        return acc;
    }, {});
    console.log("result", result)

    const template = Handlebars.compile(JSON.stringify(axios_object));
    const axios_object_string = template(result);
    
    axios_object = JSON.parse(axios_object_string);

    try {

        const response = await axios(axios_object);
        return response.data;

    } catch (error) {

        console.error('API Call Error:', error);
        throw error;

    }

};

const testFunction = (function_string:string, parameter_data:any) => {

    function_string = "(function(data) { let prompt_data = data.prompt_data; let prompt_parameters = data. prompt_parameters; const formattedParameters = {}; for (const key in prompt_parameters) { const value = prompt_parameters[key]; const parsedValue = parseFloat(value); if (!isNaN(parsedValue)) { if (Number.isInteger(parsedValue)) { formattedParameters[key] = parseInt(parsedValue); } else { formattedParameters[key] = parsedValue; } } else { formattedParameters[key] = value; } } const output = { model: 'gpt-3.5-turbo', messages: [ ...(prompt_data.context ? [{ role: 'system', content: prompt_data.context }] : []), ...(prompt_data.messages.filter(message => message.role !== 'system')) ], ...formattedParameters }; return output; })"

    let input_format = eval(function_string);
    
};


export { testAPI };