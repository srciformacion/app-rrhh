
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Briefcase,
  FileText,
  Clock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProcessDetail() {
  const { processId } = useParams<{ processId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const [loading] = useState(false);
  
  if (!processId) {
    return <div>ID de proceso no válido</div>;
  }
  
  const process = jobService.getJobById(processId);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!process) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
          <p className="text-gray-500 mb-6">El proceso que buscas no existe o no está disponible</p>
          <Link to="/portal-empleo">
            <Button>Volver a procesos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return process.fechaInicio <= now && process.fechaFin >= now;
  };
  
  const canApply = () => {
    // If not authenticated or not active, can't apply
    if (!isAuthenticated || !isActive()) return false;
    
    // If public job, anyone can apply
    if (process.tipo === 'publico') return true;
    
    // If internal job, only workers can apply
    return currentUser?.rol === 'trabajador';
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Enlace copiado",
      description: "El enlace a este proceso ha sido copiado al portapapeles"
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to="/procesos" className="text-hrm-blue hover:underline text-sm">
          &larr; Volver a procesos
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-8 mb-8">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
                {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
              </Badge>
              <Badge variant={isActive() ? "outline" : "destructive"}>
                {isActive() ? "Activo" : "Cerrado"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{process.titulo}</h1>
            
            <div className="flex flex-col gap-2 text-gray-500">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{process.grupoDestinatario}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Fecha publicación: {new Date(process.fechaInicio).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  Fecha fin presentación: {new Date(process.fechaFin).toLocaleDateString()}
                </span>
              </div>
              {process.ubicacion && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{process.ubicacion}</span>
                </div>
              )}
              {process.codigoInterno && (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Código: {process.codigoInterno}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              Compartir
            </Button>
            {canApply() ? (
              <Link to={`/aplicar/${process.id}`}>
                <Button>Postularme</Button>
              </Link>
            ) : !isAuthenticated ? (
              <Link to="/login">
                <Button>Iniciar sesión para postular</Button>
              </Link>
            ) : null}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                <p className="whitespace-pre-line">{process.descripcion}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {process.requisitos.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {process.pdfBase && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Bases del proceso</h2>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={process.pdfBase} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" /> Ver bases del proceso (PDF)
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Tipo de proceso</h3>
                    <p>{process.tipo === "publico" ? "Proceso público" : "Proceso interno"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Puesto</h3>
                    <p>{process.grupoDestinatario}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Fecha de cierre</h3>
                    <p>{new Date(process.fechaFin).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Estado</h3>
                    <p>{isActive() ? "Activo" : "Cerrado"}</p>
                  </div>
                  {process.entidadConvocante && (
                    <div>
                      <h3 className="font-medium text-gray-700">Entidad convocante</h3>
                      <p>{process.entidadConvocante}</p>
                    </div>
                  )}
                </div>
                
                {canApply() && (
                  <div className="mt-6">
                    <Link to={`/aplicar/${process.id}`}>
                      <Button className="w-full">Postularme a este proceso</Button>
                    </Link>
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="mt-6">
                    <Link to="/login">
                      <Button variant="outline" className="w-full">Iniciar sesión para postular</Button>
                    </Link>
                  </div>
                )}
                
                {isAuthenticated && !canApply() && process.tipo === 'interno' && currentUser?.rol === 'solicitante' && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 text-center">
                      Este es un proceso interno solo para empleados activos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
