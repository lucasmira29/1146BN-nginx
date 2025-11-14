import type { UserContextType } from "@/types/authContextType";
import { jwtDecode } from "jwt-decode";

export function getToken(): string | null {
  return sessionStorage.getItem("token");
}

export function setToken(value: string): void {
  sessionStorage.setItem("token", value);
}

export function removeToken(): void {
  sessionStorage.removeItem("token");
}

type DecodedJwtPayload = {
  sub: string;
  name: string;
  roles: string[];
  iat: number;
  exp: number;
};

export function decodeToken(token: string): UserContextType {
  

  const decoded = jwtDecode<DecodedJwtPayload>(token);

  const user: UserContextType = {
    id: decoded.sub,            
    name: decoded.name,
    role: decoded.roles[0].toLowerCase(),     
    email: "",  
    document: "", 
  };

  return user;
}