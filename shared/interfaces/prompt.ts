export interface Prompt {
    id: string;
    name: string;
    description: string;
    model: string;
    prompt_variables: any;
    prompt_parameters: any;
    prompt_data: any;
    new: boolean | undefined;
    model_type: string | undefined;
    organization_id: string;
    project: string | undefined;
}