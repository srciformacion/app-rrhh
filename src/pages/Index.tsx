
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated, currentUser } = useAuth();
  
  const redirectPath = () => {
    if (!isAuthenticated || !currentUser) return '/login';
    
    switch (currentUser.rol) {
      case 'rrhh':
        return '/rrhh';
      case 'trabajador':
        return '/trabajadores';
      case 'solicitante':
        return '/portal-empleo';
      default:
        return '/login';
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="lg:w-1/2 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Gestión integral para Recursos Humanos y Talento
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Plataforma modular para la gestión de personal, procesos de selección y portal del empleado. Simplifica tus procesos de RRHH con nuestra solución integral.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to={redirectPath()}>
              <Button size="lg" className="font-semibold">
                {isAuthenticated ? 'Ir a mi panel' : 'Comenzar ahora'}
              </Button>
            </Link>
            <Link to="/portal-empleo">
              <Button variant="outline" size="lg">
                Ver ofertas de trabajo
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 grid gap-6 grid-cols-1 md:grid-cols-2">
          <FeatureCard
            title="RRHH"
            description="Panel para gestión de personal, ofertas y selección"
            path="/rrhh"
            requiresAuth={true}
            role="rrhh"
          />
          <FeatureCard
            title="Portal de Empleo"
            description="Ofertas de trabajo y proceso de solicitud"
            path="/portal-empleo"
            requiresAuth={false}
          />
          <FeatureCard
            title="Portal del Trabajador"
            description="Acceso exclusivo para empleados en activo"
            path="/trabajadores"
            requiresAuth={true}
            role="trabajador"
          />
          <FeatureCard
            title="Chat"
            description="Comunicación directa con el departamento de RRHH"
            path="/chat"
            requiresAuth={true}
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  path: string;
  requiresAuth: boolean;
  role?: string;
}

const FeatureCard = ({ title, description, path, requiresAuth, role }: FeatureCardProps) => {
  const { isAuthenticated, currentUser } = useAuth();
  
  const canAccess = !requiresAuth || (isAuthenticated && (!role || currentUser?.rol === role));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-300">{title.charAt(0)}</span>
        </div>
      </CardContent>
      <CardFooter>
        {canAccess ? (
          <Link to={path} className="w-full">
            <Button variant="default" className="w-full">
              Acceder
            </Button>
          </Link>
        ) : (
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Iniciar sesión
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
