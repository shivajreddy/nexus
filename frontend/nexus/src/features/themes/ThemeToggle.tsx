import {FormEvent, useState} from "react"
import {selectTheme, updateTheme} from "./themeSlice";
import {SaveToLS} from "@/hooks";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@redux/hooks.ts";
import {IThemeOptions} from "@/types";


function ThemeToggle() {

    // state from store
    const theme = useAppSelector(selectTheme)
    const dispatch = useAppDispatch();

    const [themeOption, setThemeOption] = useState<IThemeOptions["value"]>(theme.value);

    function handleFormSubmission(e: FormEvent) {
        e.preventDefault();

        // Update state in store
        dispatch(updateTheme(themeOption))

        // Update value in LocalStorage
        SaveToLS("theme", themeOption)

        console.log("Saved to LS :: ", themeOption);
    }

    function handleSelectionChange(value: IThemeOptions["value"]) {
        setThemeOption(value)
    }


    return (
        <Card className="w-[400px] mx-4">
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <form onSubmit={handleFormSubmission}>
                            <Label htmlFor="theme">Select Theme</Label>
                            <Select value={themeOption} onValueChange={handleSelectionChange}>
                                <SelectTrigger id="theme">
                                    <SelectValue placeholder={theme.value}/>
                                </SelectTrigger>

                                <SelectContent position="popper">
                                    {/*<SelectItem value="catppuccin-latte">Light</SelectItem>*/}
                                    {/*<SelectItem value="catppuccin-frappe">Warm</SelectItem>*/}
                                    {/*<SelectItem value="catppuccin-mocha">Dark</SelectItem>*/}
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="warm">Warm</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>

                            </Select>
                            <Button variant="primary" type="submit" className="mt-4">
                                Update
                            </Button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ThemeToggle