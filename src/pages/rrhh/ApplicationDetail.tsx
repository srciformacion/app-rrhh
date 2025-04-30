
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { applicationService } from "@/services/jobService";
import { userService } from "@/services/userService";
import { jobService } from "@/services/jobService";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApplicationStatus } from "@/data/mockData";
import { notificationService } from "@/services/notificationService";
import { 
  ChevronLeft, 
  Download, 
  Mail,
  Phone,
  User,
  Calendar,
  ClipboardList
} from "lucide-react";

export default function ApplicationDetail() {
  const { hasRole } = useAuth();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { toast } = useToast();
  const [loading] = useState(false);
  const [comments, setComments] = useState("");
  
  if (!hasRole('rrhh')) {
    return <Redirect to="/login" />;
  }
  
  if (!applicationId) {
    return <div>ID de solicitud no válido</div>;
  }

  const application = applicationService.getApplicationById(applicationId);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!application) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Solicitud no encontrada</h2>
          <p className="text-gray-500 mb-6">La solicitud que buscas no existe o no está disponible</p>
          <Link to="/rrhh/procesos">
            <Button>Volver a procesos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const applicant = userService.getUserById(application.userId);
  const job = jobService.getJobById(application.jobId);
  
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    applicationService.updateApplicationStatus(applicationId, newStatus);
    
    const statusMessages = {
      aprobado: "La candidatura ha sido aprobada",
      rechazado: "La candidatura ha sido rechazada",
      pendiente: "La candidatura ha sido marcada como pendiente"
    };
    
    toast({
      title: "Estado actualizado",
      description: statusMessages[newStatus]
    });
    
    notificationService.createNotification(
      "Estado de candidatura actualizado",
      `Has actualizado el estado de la candidatura de ${applicant?.nombre || "un candidato"} a ${newStatus}`,
      newStatus === "aprobado" ? "success" : newStatus === "rechazado" ? "warning" : "info"
    );
  };
  
  const handleSaveComments = () => {
    // En una aplicación real, esto debería enviar los comentarios al servidor
    toast({
      title: "Comentarios guardados",
      description: "Los comentarios han sido guardados correctamente."
    });
    
    notificationService.createNotification(
      "Comentarios guardados", 
      `Has actualizado los comentarios para la candidatura de ${applicant?.nombre || "un candidato"}`,
      "info"
    );
  };
  
  const handleExportCV = () => {
    toast({
      title: "Descargando documento",
      description: "El CV se está descargando"
    });
    
    // En una app real, esto descargaría el documento
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to={`/rrhh/aplicaciones/${application.jobId}`} className="text-blue-600 hover:underline text-sm inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a las solicitudes
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Solicitud de {applicant?.nombre || "Candidato"}
          </h1>
          <p className="text-gray-500">
            Para: {job?.titulo} - Fecha: {new Date(application.fecha).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <StatusBadge status={application.estado} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del candidato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicant ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        {applicant.avatarUrl ? (
                          <img 
                            src={applicant.avatarUrl} 
                            alt={applicant.nombre} 
                            className="h-16 w-16 rounded-full mr-4"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{applicant.nombre}</h3>
                          <p className="text-gray-500">{applicant.rol}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Fecha de solicitud</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span>{new Date(application.fecha).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Estado actual</p>
                        <StatusBadge status={application.estado} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-600" />
                          <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                            {applicant.email}
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-600" />
                          <a href={`tel:${applicant.telefono}`} className="text-blue-600 hover:underline">
                            {applicant.telefono}
                          </a>
                        </div>
                      </div>
                      
                      {applicant.fechaNacimiento && (
                        <div>
                          <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                            <span>{new Date(applicant.fechaNacimiento).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <p>No se encontró información del candidato</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {application.motivacion && (
            <Card>
              <CardHeader>
                <CardTitle>Carta de motivación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{application.motivacion}</p>
              </CardContent>
            </Card>
          )}
          
          {application.archivosAdjuntos && application.archivosAdjuntos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {application.archivosAdjuntos.map((archivo, index) => (
                    <Button key={index} variant="outline" className="w-full justify-start" onClick={handleExportCV}>
                      <Download className="mr-2 h-4 w-4" /> {archivo}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Comentarios internos</CardTitle>
              <CardDescription>
                Estos comentarios son solo visibles para el equipo de RRHH
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe tus comentarios sobre este candidato..."
                value={comments || application.comentariosRRHH || ""}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveComments}>Guardar comentarios</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              {job ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{job.titulo}</h3>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p>{job.tipo === "publico" ? "Proceso público" : "Proceso interno"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grupo destinatario</p>
                    <p>{job.grupoDestinatario}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fechas</p>
                    <p>
                      {new Date(job.fechaInicio).toLocaleDateString()} al{" "}
                      {new Date(job.fechaFin).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/procesos/${job.id}`}>
                      <ClipboardList className="mr-2 h-4 w-4" /> Ver proceso completo
                    </Link>
                  </Button>
                </div>
              ) : (
                <p>Proceso no encontrado</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.estado !== "aprobado" && (
                  <Button 
                    variant="outline"
                    className="w-full bg-green-50 text-green-600 border-green-300 hover:bg-green-100"
                    onClick={() => handleStatusChange("aprobado")}
                  >
                    Aprobar candidatura
                  </Button>
                )}
                
                {application.estado !== "rechazado" && (
                  <Button 
                    variant="outline"
                    className="w-full bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                    onClick={() => handleStatusChange("rechazado")}
                  >
                    Rechazar candidatura
                  </Button>
                )}
                
                {application.estado !== "pendiente" && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusChange("pendiente")}
                  >
                    Marcar como pendiente
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Función en desarrollo",
                      description: "Esta funcionalidad estará disponible próximamente."
                    });
                    
                    notificationService.createNotification(
                      "Acción no disponible",
                      "Has intentado usar una funcionalidad que está en desarrollo",
                      "warning"
                    );
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> 
                  Enviar correo al candidato
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
