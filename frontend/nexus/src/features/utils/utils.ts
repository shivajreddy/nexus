// utils.ts

// Check if user has at least one of the allowed roles
function hasRoles(user_roles: number[], allowed_roles: number[]): boolean {
    return user_roles.some(role => allowed_roles.includes(role));
}

// Check if user has every role given in required roles
function hasAllRequiredRoles(user_roles: number[], required_roles: number[]): boolean {
    return required_roles.every(role => user_roles.includes(role));
}

export { hasRoles, hasAllRequiredRoles };
