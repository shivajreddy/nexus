import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast"


const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})


interface Iprops {
    data: { id: string, label: string }[];
    formLabel?: string;
    formDescription?: string;
}

export function CheckboxReactHookFormMultiple(props: Iprops) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: ["recents", "home"],
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-2 p-2">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                {
                                    // props.formLabel &&
                                  // <FormLabel className="text-base">{props.formLabel}</FormLabel>
                                }
                                {
                                  //   props.formDescription &&
                                  // <FormDescription>
                                  //     {props.formDescription}
                                  // </FormDescription>
                                }
                            </div>
                            {props.data.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="items"
                                    render={({field}) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {/*<Button type="submit">Submit</Button>*/}
            </form>
        </Form>
    )
}




