import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import type { AuthContextType } from "@/types/authContextType";

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export default useAuth;
