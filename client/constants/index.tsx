import {
  Bell,
  Compass,
  House,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "home",
    path: "/",
    icon: <House className="text-2xl" size={25} />,
  },
  {
    label: "search",
    path: "",
    icon: <Search className="text-2xl" size={25} />,
  },
  {
    label: "explore",
    path: "/explore",
    icon: <Compass className="text-2xl" size={25} />,
  },
  {
    label: "messages",
    path: "/messages",
    icon: <MessageCircle className="text-2xl" size={25} />,
  },
  {
    label: "notifications",
    path: "",
    icon: <Bell className="text-2xl" size={25} />,
  },
  {
    label: "create",
    path: "",
    icon: <SquarePlus className="text-2xl" size={25} />,
  },
] as const;
