import {useAppSelector} from "@redux/hooks.ts";
import {selectAuthState} from "@/features/auth/authSlice.ts";

export function useUserRoles(){
    const authState = useAppSelector(selectAuthState);
    return authState.user?.security.roles || [];
}
