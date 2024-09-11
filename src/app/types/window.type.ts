export type TMJWindow = {
    ORGANIZATION_ID?: string;
    APP_VERSION?: string;
    ORGANIZATIONS?: string;
    ENV?: string;
    DEFAULT_API_URL?: string;
    API_URL?: string;
    LIVERELOAD?: string;
    EFOX_API_URL?: string;
};

export type TGlobalWindow = Window & typeof globalThis & TMJWindow;
