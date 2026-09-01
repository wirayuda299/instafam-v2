import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        variables: {
          colorBackground: "#09090b",
          colorInput: "#18181b",
          colorPrimary: "#2563eb",
          colorForeground: "#ffffff",
          colorMutedForeground: "rgba(255,255,255,0.6)",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "border border-gray-800 shadow-sm",
        },
      }}
    />
  );
}
