let baseUrl;

if (import.meta.env.VITE_APP_ENV === 'development') {
    baseUrl = import.meta.env.VITE_API_URL_DEV;
} else {
    baseUrl = import.meta.env.VITE_API_URL_PROD;
}

export const BASE_URL = baseUrl;

// fosc emailing endpoint
export const FOSC_URL = "http://nexus.tecofva.com/fosc"

// Auth related endpoints
export const REFRESH_ENDPOINT = "/auth/refresh"
export const REGISTRATION_ENDPOINT = '/auth/register'
export const LOGIN_ENDPOINT = '/auth/login'


// Eagle end points
export const EAGLE_DATA_ENDPOINT = "/eagle"
export const EAGLE_DATA_DEPARTMENTS_ENDPOINT = "/eagle/departments"


// Public end points
export const PUBLIC_DATA_DEPARTMENTS = "/public/departments"

