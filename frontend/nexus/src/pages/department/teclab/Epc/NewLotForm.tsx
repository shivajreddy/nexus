import {toast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {Switch} from "@/components/ui/switch"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import "@/assets/pages/Epc/NewLotForm.css"


const FormSchema = z.object({
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
})


const NewLotForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            security_emails: true,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div id="new-lot-form">

                    <div className="new-lot-section" id="new-lot-form-lot-info">
                        <p className="section-card-title text-2xl font-bold">Lot Info</p>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="marketing_emails"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Marketing emails
                                            </FormLabel>
                                            <FormDescription>
                                                Receive emails about new products, features, and more.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="security_emails"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Security emails</FormLabel>
                                            <FormDescription>
                                                Receive emails about your account security.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled
                                                aria-readonly
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-drafting">
                        <p className="section-card-title text-2xl font-bold">Drafting</p>
                        <div>
                            <label>some label </label>
                            <input type="text"/>
                        </div>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-engineering">
                        <p className="section-card-title text-2xl font-bold">Engineering</p>
                        <div className="section-card-field-text">
                            <label htmlFor="community">Community</label>
                            <input id="community" type="text"/>
                        </div>
                        <div className="section-card-field-dropdown">
                            <label></label>
                        </div>
                        <div className="section-card-field-checkbox">
                            <label htmlFor="">Date:</label>
                            <input id="" type="date"/>
                        </div>
                        <div className="section-card-field-date">
                            <label htmlFor="">Date:</label>
                            <input id="" type="date"/>
                        </div>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-plat">
                        <p className="section-card-title text-2xl font-bold">Plat</p>
                        <label>some label </label>
                        <input type="text"/>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-permitting">
                        <p className="section-card-title text-2xl font-bold">Permitting</p>
                        <label>some label </label>
                        <input type="text"/>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-build-by-plans">
                        <p className="section-card-title text-2xl font-bold">Build By Plans</p>
                        <label>some label </label>
                        <input type="text"/>
                    </div>

                    <div className="new-lot-section" id="new-lot-form-notes">
                        <p className="section-card-title text-2xl font-bold">Notes</p>
                        <label>some label </label>
                        <input type="text"/>
                    </div>

                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
};


export default NewLotForm;


export function SwitchForm() {
}
