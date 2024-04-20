export interface Prompt {
    id: string;
    name: string;
    description: string;
    model: string;
    prompt_variables: any;
    model_parameters: any;
    prompt_data: any;
    new: boolean | undefined;
    model_type: string | undefined;
    organization_id: string;
    project: string | undefined;
    provider: string | undefined;
    app?: string | null;
}