
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { MessageCircle } from "lucide-react";
import { chatService } from "@/services/chatService";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const count = chatService.getUnreadMessageCount(currentUser.id);
      setUnreadCount(count);
    }
  }, [isAuthenticated, currentUser]);

  return (
    <header className="bg-white shadow-md">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hrm-blue">
                TalentNexus
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4 items-center">
            {isAuthenticated && currentUser?.rol === 'rrhh' && (
              <Link to="/rrhh" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                Panel RRHH
              </Link>
            )}
            {isAuthenticated && currentUser?.rol === 'trabajador' && (
              <Link to="/trabajadores" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                Portal del Trabajador
              </Link>
            )}
            <Link to="/portal-empleo" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Portal de Empleo
            </Link>
            {isAuthenticated && (
              <Link to="/chat" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 relative">
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          <div className="flex items-center">
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Iniciar sesión</Button>
                </Link>
                <Link to="/portal-empleo">
                  <Button>Ofertas de empleo</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
