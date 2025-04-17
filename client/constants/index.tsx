import {
  Bell,
  Compass,
  House,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/v1";

export class RequestConfig {
  public method: RequestInit["method"] = "GET"; // More typical default
  public credentials: RequestInit["credentials"] = "include";
  public headers: Headers = new Headers({ "content-type": "application/json" });
  private _body?: RequestInit["body"];

  constructor(method: RequestInit["method"]) {
    this.method = method;
  }

  setBody(body: string | FormData) {
    if (this.method === "GET" || this.method === "HEAD") {
      this._body = undefined;
      return; // Return early for GET/HEAD methods
    }

    if (body instanceof FormData) {
      this.headers.delete("content-type");
    } else {
      this.headers.set("content-type", "application/json");
    }
    this._body = body;
  }

  get body(): RequestInit["body"] | undefined {
    if (this.method === "GET" || this.method === "HEAD") {
      return undefined;
    }
    return this._body;
  }

  toRequestInit(): RequestInit {
    const requestInit: RequestInit = {
      method: this.method,
      credentials: this.credentials,
      headers: this.headers,
    };

    if (this.body !== undefined) {
      requestInit.body = this.body;
    }

    return requestInit;
  }
}
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
  "Sale of illegal or regulated goods",
] as const;
