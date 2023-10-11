import {toast} from "@components/ui/use-toast.ts"
import {Button} from "@components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@components/ui/form.tsx"
import {Switch} from "@components/ui/switch.tsx"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import "@assets/pages/Epc/NewLotForm.css"
import {Textarea} from "@components/ui/textarea.tsx";

import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils.ts"
import {Calendar} from "@components/ui/calendar.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover.tsx"
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx"
import {useState} from "react";
import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import FieldDate from "@pages/department/teclab/Epc/NewLot/FieldDate.tsx";


const FormSchema = z.object({
    // Lot-info
    lot_status_finished: z.boolean().default(false).optional(),
    lot_status_released: z.boolean().default(false).optional(),
    community_name: z.string(),
    section_number: z.number(),
    contract_date: z.date(),
    product_name: z.string(),   // TODO: this is should be a drop-down
    elevation_name: z.string(),   // TODO: this is should be a drop-down

    // Drafting
    drafting_drafter: z.string(), // TODO: drop down of drafters
    drafting_dread_line: z.date(),
    drafting_finished: z.date(),

    // Engineering
    engineering_engineer: z.string(), // TODO: engineers list
    engineering_sent: z.date(),
    engineering_expected: z.date(),
    engineering_received: z.date(),

    // Plat
    plat_engineer: z.string(), // TODO: plat engineer's list
    plat_sent: z.date(),
    plat_expected: z.date(),
    plat_received: z.date(),

    //Permitting
    permitting_count_name: z.string(), // TODO: county's names list
    permitting_expected_submit: z.date(),
    permitting_submitted: z.date(),
    permitting_received: z.date(),

    // Build By Plans
    bbp_expected_post: z.date(),
    bbp_posted: z.date(),

    // Notes
    notes: z.string()
})


const NewLotForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // security_emails: true,
        },
    })

    // Form's State
    // const [formState, setFormState]  = useState<IFormData>();
    const [date, setDate] = useState<Date | undefined>(new Date());

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
                        <FormField
                            control={form.control}
                            name="lot_status_finished"
                            render={({field}) => (
                                <FormItem
                                    className="flex items-center space-y-0 my-2">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-xl pl-2">
                                        Finished
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lot_status_released"
                            render={({field}) => (
                                <FormItem
                                    className="flex flex-row  space-y-0 my-2">
                                    <FormControl className="flex">
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-xl pl-2">
                                        Released
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FieldDate id="1_contract_date" name="Contract Date"/>
                        <FieldText id="1_section" name={"Section"}/>
                        <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                        <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                        <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
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
                        <Textarea placeholder="Notes aboue the lot"/>
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
