export interface IVKIDPayload {
    type: string;
    code: string;
    state: string;
    device_id: string;
    redirectURI?: string;
}
