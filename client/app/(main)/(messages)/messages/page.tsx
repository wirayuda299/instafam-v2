import Image from "next/image";

export default function Messages() {
  return (
    <div className="hidden min-h-screen w-full items-center justify-center overflow-y-auto md:flex">
      <Image
        className="aspect-auto size-36 invert"
        src={"/assets/messages/images/chat.png"}
        width={100}
        height={100}
        alt="messages"
      />
    </div>
  );
}
