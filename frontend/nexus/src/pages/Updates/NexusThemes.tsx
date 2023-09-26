import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

function NexusThemes() {
  return (
    <div className="nexus-update-post">

      <p className="font-bold text-4xl text-center m-4">Design Scheme</p>

      <div >
        <p className="text-4xl mb-8">Typography</p>
        <div className="flex justify-around">
          <div>
            <p className="text-4xl font-sans">Sans</p>
            <p className="text-4xl font-serif">Serif</p>
            <p className="text-4xl font-mono">Mono</p>
          </div>
          <div>
            <p className="text-4xl font-thin">Font-Thin</p>
            <p className="text-4xl font-light">Font-Light</p>
            <p className="text-4xl font-normal">Font-Normal</p>
            <p className="text-4xl font-bold">Font-Bold</p>
            <p className="text-4xl font-extrabold">Font-ExtraBold</p>
            <p className="text-4xl font-black">Font-Black</p>
          </div>
          <div>
            <p className="text-sm">text-small</p>
            <p className="text-md">text-medium</p>
            <p className="text-lg">text-large</p>
            <p className="text-xl">text-xl</p>
            <p className="text-2xl">text-2xl</p>
            <p className="text-3xl">text-3xl</p>
            <p className="text-4xl">text-4xl</p>
            <p className="text-5xl">text-5xl</p>
            <p className="text-6xl">text-6xl</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mb-6">
          <p className="text-4xl mb-8">Buttons</p>
          <Button className="m-2" variant="default">Default</Button>
          <Button className="m-2" variant="inverted">Inverted</Button>
          <Button className="m-2" variant="primary">Primary</Button>
          <Button className="m-2" variant="primaryInverted">Primary-Inverted</Button>
          <Button className="m-2" variant="secondary">Secondary</Button>
          <Button className="m-2" variant="secondaryInverted">Secondary-Inverted</Button>
          <Button className="m-2" variant="destructive">Destructive</Button>
          <Button className="m-2" variant="destructiveInverted">Destr.Inversed</Button>
          <Button className="m-2" variant="outline">Outline</Button>
          <Button className="m-2" variant="ghost">Ghost</Button>
          <Button className="m-2" variant="link">Link</Button>
        </div>
        <div>
          <p className="text-4xl mb-8">Cards</p>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructiveInverted">Cancel</Button>
              <Button variant="secondary">Deploy</Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <p className="text-4xl mt-8 mb-8">Color</p>
        </div>
      </div>

      <div>
      </div>

    </div >
  )
}

export default NexusThemes