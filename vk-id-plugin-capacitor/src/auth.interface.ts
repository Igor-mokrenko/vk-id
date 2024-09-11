export interface IAuthProps {
    clientId: string;
    clientSecret: string;
    state: string;
    codeChallenge: string;
    scope: string[];
}

export interface IAuthResult {
    data?: {
        state: string;
        code: string;
        deviceId: string;
        redirectURI: string | null;
    };
    success: boolean;
    error?: string;
}
