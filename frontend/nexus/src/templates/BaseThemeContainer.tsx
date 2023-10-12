/*
:: BaseThemeContainer.tsx
+ Responsible for setting up the theme
*/

import {ReactNode, useEffect} from "react";
import {selectTheme, updateTheme} from "@/features/themes/themeSlice.ts";
import {IThemeOptions} from "@/types";
import {GetFromLS, SaveToLS} from "@/hooks";
import {useAppDispatch, useAppSelector} from "@redux/hooks.ts";


interface IProps {
    children: ReactNode;
}


function BaseThemeContainer({children}: IProps) {

    // * THEMING -------------------------------------------
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch()

    // :: Update store with user-preferred theme, else set default theme in state & LS
    useEffect(() => {
        const defaultProjectTheme: IThemeOptions = {value: "light"};
        // const defaultProjectTheme: IThemeOptions = {value: "catppuccin-mocha"};
        // const defaultProjectTheme: IThemeOptions = {value: "nexus-theme-light"};
        const currentLocalThemeValue = GetFromLS("theme");

        // + There is no valid nexus-theme value in local storage
        if (currentLocalThemeValue === null ||
            currentLocalThemeValue === undefined ||
            // !["nexus-theme-light", "nexus-theme-warm", "nexus-theme-dark"].includes(currentLocalThemeValue)
            // !["catppuccin-latte", "catppuccin-frappe", "catppuccin-mocha"].includes(currentLocalThemeValue)
            !["light", "warm", "dark"].includes(currentLocalThemeValue)
        ) {
            SaveToLS("theme", defaultProjectTheme.value)
        } else {
            dispatch(updateTheme(currentLocalThemeValue))
        }
    }, [dispatch, theme])

    // :: Apply Theme to DOM
    useEffect(() => {
        // document.body.classList.remove('nexus-theme-light', 'nexus-theme-dark', 'nexus-theme-warm');
        // document.body.classList.remove('catppuccin-latte', 'catppuccin-frappe', 'catppuccin-mocha');
        document.body.classList.remove('light', 'warm', 'dark');
        document.body.classList.add(`${theme.value}`);
    }, [theme])
    // * THEMING -------------------------------------------

    return (
        <div>
            {children}
        </div>
    )

}


export default BaseThemeContainer