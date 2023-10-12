// + State :: Theme
// value: "nexus-theme-light" | "nexus-theme-warm" | "nexus-theme-dark"
export interface IThemeOptions {
    value: "catppuccin-latte" | "catppuccin-frappe" | "catppuccin-mocha"
}

export interface ThemeContextInterface {
    theme: IThemeOptions;

    updateTheme(newTheme: IThemeOptions): void;
}


// + State :: Security 
export interface IAuthState {
    user?: IUser;
    accessToken?: string;
}


export interface IUser {
    username: string;
    department: string;
    team: string;
    roles: [number];
}


// :: Types for API-Slice
export interface ILoginResponse {
    status: number;
    access_token: string;
    roles: [number];
    username: string;
    department: string;
    team: string;
}

export interface ILogoutResponse {
    result: string;
}

export interface ICredentials {
    username: string;
    password: string;
}


export interface IRefreshResponse {
    status: string;
    new_access_token: string;
    roles: [number];
    username: string;
    department: string;
    team: string;
}
