export interface Log {
    id: string;
    message: any;
    raw_response: any;
    raw_request: any;
    status: number;
    model_id: string;
    prompt_id: string;
    createdAt: Date;
    organization_id: string;
}