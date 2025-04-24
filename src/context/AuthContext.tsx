
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, mockUsers } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      
      // Redirect based on role
      switch(user.rol) {
        case 'rrhh':
          navigate('/rrhh');
          break;
        case 'trabajador':
          navigate('/trabajadores');
          break;
        case 'solicitante':
          navigate('/portal-empleo');
          break;
        default:
          navigate('/');
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido/a, ${user.nombre}`,
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return currentUser?.rol === role;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAuthenticated: !!currentUser,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
