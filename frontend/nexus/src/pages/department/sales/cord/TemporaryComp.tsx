import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

interface Iprops {
    data: { id: string, label: string }[];
    formLabel?: string;
    formDescription?: string;
}

const TemporaryComp= (props: Iprops) => {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
        arr.push(i);
    }

    return (
        <div>
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                        {
                            props.data.map((item) => (
                                <CommandItem key={item.id}>
                                    {item.label}
                                </CommandItem>
                            ))
                        }
                </CommandList>
            </Command>

        </div>
    );
};

export default TemporaryComp;
