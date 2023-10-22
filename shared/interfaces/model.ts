export interface Model {
    id: string;
    name: string;
    type: string;
    roles: string;
    api_call: any;
    input_format: string;
    output_format: string;
    model_parameters: any;
    default: boolean;
    organization_id: string;
}