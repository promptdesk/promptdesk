export interface Model {
    id: string;
    name: string;
    type: string;
    api_call: any;
    input_format: string;
    output_format: string;
    model_parameters: any;
    default: boolean;
    organization_id: string;
    provider: string;
    deleted: boolean;
    request_mapping: any;
    response_mapping: any;
}