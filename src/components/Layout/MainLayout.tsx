
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-inner py-4 border-t">
        <div className="container max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2024 - Sistema de Gestión de Personal - Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
};
