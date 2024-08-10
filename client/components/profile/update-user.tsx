import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function UpdateUser() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className="bg-black-1/50 hover:bg-black-1/60"
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        Update User
      </DialogContent>
    </Dialog>
  )
}
