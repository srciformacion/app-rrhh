
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService, applicationService } from "@/services/jobService";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { ApplicationsList } from "@/components/UI/ApplicationsList";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ApplicationStatus } from "@/data/mockData";
import { ChevronLeft, Users, FileText, CalendarCheck, Download } from "lucide-react";

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
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
          <p className="text-gray-500 mb-6">El proceso que buscas no existe o no está disponible</p>
          <Link to="/rrhh/procesos">
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
  
  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    applicationService.updateApplicationStatus(applicationId, newStatus);
    toast({
      title: "Estado actualizado",
      description: `La solicitud ha sido marcada como ${newStatus}.`
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Exportación en proceso",
      description: "Los datos se están exportando a Excel."
    });
    // Implementación futura para exportar a Excel
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to="/rrhh/procesos" className="text-blue-600 hover:underline text-sm inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a procesos
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
              {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
            </Badge>
            <Badge variant={isActive() ? "outline" : "destructive"}>
              {isActive() ? "Activo" : "Cerrado"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-1">{process.titulo}</h1>
          <p className="text-gray-500">{process.grupoDestinatario} - {new Date(process.fechaInicio).toLocaleDateString()} al {new Date(process.fechaFin).toLocaleDateString()}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Exportar datos
          </Button>
          <Button asChild>
            <Link to={`/rrhh/procesos/${process.id}`}>
              <FileText className="h-4 w-4 mr-2" /> Editar proceso
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total candidatos</p>
              <h3 className="text-3xl font-bold">{allApplications.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Pendientes</p>
              <h3 className="text-3xl font-bold text-yellow-500">{pendingApplications.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Aprobados</p>
              <h3 className="text-3xl font-bold text-green-500">{approvedApplications.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Rechazados</p>
              <h3 className="text-3xl font-bold text-red-500">{rejectedApplications.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de candidaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="applications">
                Todas ({allApplications.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aprobadas ({approvedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rechazadas ({rejectedApplications.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <ApplicationsList 
                applications={allApplications}
                users={allUsers}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <ApplicationsList 
                applications={pendingApplications}
                users={allUsers}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <ApplicationsList 
                applications={approvedApplications}
                users={allUsers}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <ApplicationsList 
                applications={rejectedApplications}
                users={allUsers}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
