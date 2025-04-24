
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const [loading] = useState(false);
  
  if (!jobId) {
    return <div>ID de oferta no válido</div>;
  }
  
  const job = jobService.getJobById(jobId);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Oferta no encontrada</h2>
          <p className="text-gray-500 mb-6">La oferta que buscas no existe o no está disponible</p>
          <Link to="/portal-empleo">
            <Button>Volver a ofertas</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return job.fechaInicio <= now && job.fechaFin >= now;
  };
  
  const canApply = () => {
    // If not authenticated or not active, can't apply
    if (!isAuthenticated || !isActive()) return false;
    
    // If public job, anyone can apply
    if (job.tipo === 'publico') return true;
    
    // If internal job, only workers can apply
    return currentUser?.rol === 'trabajador';
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Enlace copiado",
      description: "El enlace a esta oferta ha sido copiado al portapapeles"
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to="/portal-empleo" className="text-hrm-blue hover:underline text-sm">
          &larr; Volver a ofertas
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-8 mb-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={job.tipo === "publico" ? "default" : "secondary"}>
                {job.tipo === "publico" ? "Oferta pública" : "Oferta interna"}
              </Badge>
              <Badge variant={isActive() ? "outline" : "destructive"}>
                {isActive() ? "Activa" : "Cerrada"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{job.titulo}</h1>
            <div className="flex items-center text-gray-500 mb-2">
              <Users className="h-4 w-4 mr-1" />
              <span>{job.grupoDestinatario}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Publicada: {new Date(job.fechaInicio).toLocaleDateString()} - 
                Cierra: {new Date(job.fechaFin).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              Compartir
            </Button>
            {canApply() ? (
              <Link to={`/portal-empleo/aplicar/${job.id}`}>
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
                <p className="whitespace-pre-line">{job.descripcion}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {job.requisitos.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Tipo de proceso</h3>
                    <p>{job.tipo === "publico" ? "Oferta pública" : "Oferta interna"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Departamento</h3>
                    <p>{job.grupoDestinatario}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Fecha de cierre</h3>
                    <p>{new Date(job.fechaFin).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Estado</h3>
                    <p>{isActive() ? "Activa" : "Cerrada"}</p>
                  </div>
                </div>
                
                {canApply() && (
                  <div className="mt-6">
                    <Link to={`/portal-empleo/aplicar/${job.id}`}>
                      <Button className="w-full">Postularme a esta oferta</Button>
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
                
                {isAuthenticated && !canApply() && job.tipo === 'interno' && currentUser?.rol === 'solicitante' && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 text-center">
                      Esta es una oferta interna solo para empleados activos
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
