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


export const REPORT_POST_REASONS: string[] = [
	"It's spam",
	"Nudity or sexual content",
	"Hate speech or symbols",
	"Violence or dangerous organizations",
	"Harassment or bullying",
	"False information",
	"Scam or fraud",
	"Intellectual property violation",
	"Self-harm or suicide",
	"Sale of illegal or regulated goods"
] as const

