import type { UserContextType } from "@/types/authContextType";
import { jwtDecode } from "jwt-decode";

export function getToken() : string | null {
  return sessionStorage.getItem("token");
}

export function setToken(value: string) : void {
  sessionStorage.setItem("token", value)
}

export function removeToken() : void {
  sessionStorage.removeItem("token");
}

export function decodeToken(token : string) : UserContextType {
  return jwtDecode(token);
}