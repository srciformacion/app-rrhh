
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/Layout/MainLayout";
import { mockUsers } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const rrhhUsers = mockUsers.filter(user => user.rol === 'rrhh');
  const workers = mockUsers.filter(user => user.rol === 'trabajador');
  const applicants = mockUsers.filter(user => user.rol === 'solicitante');
  
  const handleLogin = (userId: string) => {
    login(userId);
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Iniciar sesión</h1>
          <p className="text-gray-500 mt-2">Selecciona un rol para acceder a la demo</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Selector de rol</CardTitle>
            <CardDescription>
              Elige el tipo de usuario con el que deseas ingresar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button 
                variant={selectedRole === 'rrhh' ? "default" : "outline"} 
                className="w-full justify-start text-left"
                onClick={() => setSelectedRole('rrhh')}
              >
                Recursos Humanos
              </Button>
              <Button 
                variant={selectedRole === 'trabajador' ? "default" : "outline"} 
                className="w-full justify-start text-left"
                onClick={() => setSelectedRole('trabajador')}
              >
                Trabajador
              </Button>
              <Button 
                variant={selectedRole === 'solicitante' ? "default" : "outline"} 
                className="w-full justify-start text-left"
                onClick={() => setSelectedRole('solicitante')}
              >
                Solicitante de empleo
              </Button>
            </div>
            
            {selectedRole && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Selecciona un usuario:</h3>
                <div className="space-y-3">
                  {selectedRole === 'rrhh' && rrhhUsers.map(user => (
                    <UserLoginCard key={user.id} user={user} onLogin={handleLogin} />
                  ))}
                  {selectedRole === 'trabajador' && workers.map(user => (
                    <UserLoginCard key={user.id} user={user} onLogin={handleLogin} />
                  ))}
                  {selectedRole === 'solicitante' && applicants.map(user => (
                    <UserLoginCard key={user.id} user={user} onLogin={handleLogin} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-gray-500">
              Esta es una aplicación de demo con usuarios simulados.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}

interface UserLoginCardProps {
  user: {
    id: string;
    nombre: string;
    email: string;
    avatarUrl?: string;
  };
  onLogin: (userId: string) => void;
}

const UserLoginCard = ({ user, onLogin }: UserLoginCardProps) => {
  return (
    <div 
      className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer"
      onClick={() => onLogin(user.id)}
    >
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.nombre} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-600">
              {user.nombre.charAt(0)}
            </span>
          )}
        </div>
        <div className="ml-3">
          <p className="font-medium">{user.nombre}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onLogin(user.id)}>
        Acceder
      </Button>
    </div>
  );
};
