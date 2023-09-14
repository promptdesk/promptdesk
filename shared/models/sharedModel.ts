export interface Model {
    id: string;
    name: string;
    type: string;
    roles: string;
    api_call: any;
    format_function: string;
    post_format_function: string;
    model_parameters: any;
    default: boolean;
}