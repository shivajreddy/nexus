// utils.ts

function hasRoles(user_roles: [number] | [], allowed_roles: [number]): boolean {
    // @ts-ignore
    return allowed_roles.every((role) => user_roles.includes(role));
}


export { hasRoles };
