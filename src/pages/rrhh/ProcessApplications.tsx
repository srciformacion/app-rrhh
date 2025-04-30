
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService, applicationService } from "@/services/jobService";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApplicationStatus } from "@/data/mockData";
import { exportApplicationsToCSV } from "@/utils/exportUtils";
import { notificationService } from "@/services/notificationService";
import { ProcessHeader } from "@/components/processes/ProcessHeader";
import { ProcessStats } from "@/components/processes/ProcessStats";
import { ProcessApplicationsTabs } from "@/components/processes/ProcessApplicationsTabs";
import { ProcessNotFound } from "@/components/processes/ProcessNotFound";

export default function ProcessApplications() {
  const { hasRole } = useAuth();
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  
  if (!hasRole('rrhh')) {
    return <Redirect to="/login" />;
  }
  
  if (!processId) {
    return <div>ID de proceso no válido</div>;
  }

  const process = jobService.getJobById(processId);
  const allApplications = applicationService.getApplicationsByJobId(processId);
  const allUsers = userService.getAllUsers();
  
  const pendingApplications = allApplications.filter(app => app.estado === "pendiente");
  const approvedApplications = allApplications.filter(app => app.estado === "aprobado");
  const rejectedApplications = allApplications.filter(app => app.estado === "rechazado");
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!process) {
    return (
      <MainLayout>
        <ProcessNotFound />
      </MainLayout>
    );
  }
  
  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    applicationService.updateApplicationStatus(applicationId, newStatus);
    
    // Mostrar toast de confirmación
    const statusMessages = {
      aprobado: "La candidatura ha sido aprobada",
      rechazado: "La candidatura ha sido rechazada",
      pendiente: "La candidatura ha sido marcada como pendiente"
    };
    
    toast({
      title: "Estado actualizado",
      description: statusMessages[newStatus]
    });
    
    // Crear notificación interna
    notificationService.createNotification(
      "Estado de candidatura actualizado",
      `Has cambiado el estado de una candidatura a ${newStatus}`,
      newStatus === "aprobado" ? "success" : newStatus === "rechazado" ? "warning" : "info"
    );
  };
  
  const handleExport = () => {
    // Exportar los datos de las solicitudes activas en el tab actual
    let applicationsToExport;
    
    switch (activeTab) {
      case "pending":
        applicationsToExport = pendingApplications;
        break;
      case "approved":
        applicationsToExport = approvedApplications;
        break;
      case "rejected":
        applicationsToExport = rejectedApplications;
        break;
      default:
        applicationsToExport = allApplications;
    }
    
    const filename = `candidatos-${process.titulo.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}`;
    
    exportApplicationsToCSV(applicationsToExport, allUsers, filename);
    
    toast({
      title: "Exportación completada",
      description: "Los datos han sido exportados correctamente"
    });
    
    notificationService.createNotification(
      "Datos exportados",
      `Has exportado los datos de ${applicationsToExport.length} candidatos del proceso "${process.titulo}"`,
      "success"
    );
  };
  
  return (
    <MainLayout>
      <ProcessHeader process={process} handleExport={handleExport} />
      
      <ProcessStats 
        allApplications={allApplications}
        pendingApplications={pendingApplications}
        approvedApplications={approvedApplications}
        rejectedApplications={rejectedApplications}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de candidaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessApplicationsTabs
            allApplications={allApplications}
            pendingApplications={pendingApplications}
            approvedApplications={approvedApplications}
            rejectedApplications={rejectedApplications}
            users={allUsers}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleStatusChange={handleStatusChange}
            handleExport={handleExport}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
