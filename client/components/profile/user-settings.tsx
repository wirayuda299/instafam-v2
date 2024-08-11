
'use client'

import { Cog } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Label } from "../ui/label"
import { Switch } from "@/components/ui/switch"
import { updateSettingSchema, UpdateSettingSchema } from "@/validation"


type Props = { userId: string, userSessionId: string, settings: UpdateSettingSchema }

export default function UserSetting({ userId, settings, userSessionId }: Props) {

  const form = useForm<UpdateSettingSchema>({
    resolver: zodResolver(updateSettingSchema),
    defaultValues: {
      show_draft_posts: settings.show_draft_posts,
      show_mention: settings.show_mention,
      show_saved_post: settings.show_draft_posts
    }
  })


  const handleUpdateProfile = async (data: UpdateSettingSchema) => {
    try {
      const { updateUserSetting } = await import('@/helper/users')
      await updateUserSetting(userId, userSessionId, data.show_mention, data.show_saved_post, data.show_draft_posts, window.location.pathname)
    } catch (e) {
      toast.error((e as Error).message || "Failed to update setting")
    }

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-black-1/50 hover:bg-black-1/60" title="Setting" name="setting">
          <Cog />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-black-1 p-0 border-none'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateProfile)}
          >
            <h3 className='text-center font-semibold text-2xl py-2'>Settings</h3>
            <FormField
              control={form.control}
              name='show_mention'
              render={({ field }) => (
                <FormItem className='flex items-center p-3 w-full justify-between  hover:bg-black-1/50 hover:brightness-110'>
                  <Label>

                    Show mention
                  </Label>
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
              name='show_saved_post'
              render={({ field }) => (
                <FormItem className='flex items-center p-3 w-full justify-between hover:bg-black-1/50 hover:brightness-110'>
                  <Label>

                    Show saved posts
                  </Label>
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
              name='show_draft_posts'
              render={({ field }) => (
                <FormItem className='flex items-center p-3 w-full justify-between hover:bg-black-1/50 hover:brightness-110'>
                  <Label>
                    Show draft posts
                  </Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <button name='save' title='save' className='w-full hover:bg-blue-500 bg-blue-600 p-2 rounded-md'>
              Save
            </button>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

}
