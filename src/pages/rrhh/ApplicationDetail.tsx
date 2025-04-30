
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { applicationService } from "@/services/jobService";
import { userService } from "@/services/userService";
import { jobService } from "@/services/jobService";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";
import { ChevronLeft } from "lucide-react";
import { JobApplication } from "@/data/jobTypes";

// Import refactored components
import { ApplicantInfo } from "@/components/applications/ApplicantInfo";
import { MotivationLetter } from "@/components/applications/MotivationLetter";
import { AttachedDocuments } from "@/components/applications/AttachedDocuments";
import { InternalComments } from "@/components/applications/InternalComments";
import { JobProcessInfo } from "@/components/applications/JobProcessInfo";
import { ApplicationActions } from "@/components/applications/ApplicationActions";

export default function ApplicationDetail() {
  const { hasRole } = useAuth();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { toast } = useToast();
  const [loading] = useState(false);
  
  if (!hasRole('rrhh')) {
    return <Redirect to="/login" />;
  }
  
  if (!applicationId) {
    return <div>ID de solicitud no válido</div>;
  }

  // Cast application to JobApplication to match the expected interface
  const application = applicationService.getApplicationById(applicationId) as unknown as JobApplication;
  
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
  const job = jobService.getJobById(application.processId || application.jobId);
  
  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
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
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to={`/rrhh/aplicaciones/${application.processId || application.jobId}`} className="text-blue-600 hover:underline text-sm inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a las solicitudes
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Solicitud de {applicant?.nombre || "Candidato"}
          </h1>
          <p className="text-gray-500">
            Para: {job?.titulo} - Fecha: {new Date(application.fechaPostulacion || application.fecha).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <StatusBadge status={application.estado} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ApplicantInfo 
            applicant={applicant} 
            applicationDate={application.fechaPostulacion || application.fecha}
            status={application.estado}
          />
          
          <MotivationLetter motivacion={application.motivacion} />
          
          <AttachedDocuments documents={application.archivosAdjuntos} />
          
          <InternalComments 
            initialComments={application.comentariosRRHH} 
            applicantName={applicant?.nombre}
          />
        </div>
        
        <div className="space-y-6">
          <JobProcessInfo job={job} />
          
          <ApplicationActions
            applicationId={applicationId}
            currentStatus={application.estado}
            applicantName={applicant?.nombre}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </MainLayout>
  );
}

// This component is used in-place instead of importing from StatusBadge.tsx
// to avoid circular dependencies with the ApplicantInfo component
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'aprobado':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-100 text-green-800 text-xs font-medium">
          Aprobado
        </span>
      );
    case 'rechazado':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-xs font-medium">
          Rechazado
        </span>
      );
    case 'pendiente':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium">
          Pendiente
        </span>
      );
  }
}
