// + State :: Theme
// value: "nexus-theme-light" | "nexus-theme-warm" | "nexus-theme-dark"
export interface IThemeOptions {
    // value: "catppuccin-latte" | "catppuccin-frappe" | "catppuccin-mocha"
    value: "light" | "warm" | "dark"
}

export interface ThemeContextInterface {
    theme: IThemeOptions;

    updateTheme(newTheme: IThemeOptions): void;
}


// + State :: Security 
export interface IAuthState {
    accessToken?: string;
    user?: IUser;
}


export interface IUser {
    username: string;
    security: {
        roles: [number];
        hashed_password: string;
        verified: boolean;
        created_at?: string;
    },
    user_info: {
        first_name: string;
        last_name: string;
        work_phone?: string;
        personal_phone?: string;
        department: string;
        teams: [string];
        job_title: string;
    }
}


// :: Types for API-Slice

export interface ILoginResponse {
    access_token: string;
    user: IUser;
}

export interface ILogoutResponse {
    result: string;
}

export interface ICredentials {
    username: string;
    password: string;
}

// export interface IRefreshResponse {
//     status: string;
//     new_access_token: string;
//     roles: [number];
//     username: string;
//     department: string;
//     team: string;
// }

export interface IRefreshResponse {
    new_access_token: string;
    user: IUser;
}
