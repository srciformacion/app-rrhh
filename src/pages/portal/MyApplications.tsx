import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { applicationService } from "@/services/jobService";
import { jobService } from "@/services/jobService";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !currentUser) {
    return <Redirect to="/login" />;
  }
  
  const userApplications = applicationService.getUserApplications(currentUser.id);
  
  const pendingApplications = userApplications.filter(app => app.estado === 'pendiente');
  const approvedApplications = userApplications.filter(app => app.estado === 'aprobado');
  const rejectedApplications = userApplications.filter(app => app.estado === 'rechazado');
  
  const getJobTitle = (jobId: string) => {
    const job = jobService.getJobById(jobId);
    return job ? job.titulo : 'Oferta no disponible';
  };
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mis postulaciones</h1>
        <p className="text-gray-500 mt-1">Historial y estado de tus candidaturas</p>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">
            Todas ({userApplications.length})
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
        
        <TabsContent value="all">
          <ApplicationList applications={userApplications} getJobTitle={getJobTitle} />
        </TabsContent>
        
        <TabsContent value="pending">
          <ApplicationList applications={pendingApplications} getJobTitle={getJobTitle} />
        </TabsContent>
        
        <TabsContent value="approved">
          <ApplicationList applications={approvedApplications} getJobTitle={getJobTitle} />
        </TabsContent>
        
        <TabsContent value="rejected">
          <ApplicationList applications={rejectedApplications} getJobTitle={getJobTitle} />
        </TabsContent>
      </Tabs>
      
      <div className="text-center my-8">
        <p className="text-gray-500 mb-4">¿Buscando nuevas oportunidades?</p>
        <Link to="/portal-empleo" className="text-hrm-blue hover:underline">
          Ver ofertas disponibles
        </Link>
      </div>
    </MainLayout>
  );
}

const ApplicationList = ({ applications, getJobTitle }: { applications: any[], getJobTitle: (jobId: string) => string }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-600 mb-2">No hay postulaciones</h3>
        <p className="text-gray-500">
          No tienes postulaciones en esta categoría
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {applications.map(application => (
        <Card key={application.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {getJobTitle(application.jobId)}
                </h3>
                <div className="text-sm text-gray-500 mb-2">
                  Postulado el: {new Date(application.fecha).toLocaleDateString()}
                </div>
                {application.motivacion && (
                  <p className="text-gray-700 mt-4 line-clamp-2">
                    {application.motivacion}
                  </p>
                )}
                {application.comentariosRRHH && application.estado !== 'pendiente' && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm font-medium">Comentarios de RRHH:</p>
                    <p className="text-sm">{application.comentariosRRHH}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <StatusBadge status={application.estado} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
