import { StatusBadge } from '@/components/StatusBadge'; // ajusta la ruta si es diferente
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { jobService, applicationService } from "@/services/jobService";
import { Link } from "react-router-dom";
import { JobCard } from "@/components/UI/JobCard";
import { Redirect } from "@/components/UI/Redirect";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserNav } from "@/components/Layout/UserNav";
import { DashboardCard } from "@/components/UI/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkerDashboard() {
  const { currentUser, isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const availableJobs = jobService.getActiveInternalJobs();
  const myApplications = currentUser ? applicationService.getUserApplications(currentUser.id) : [];
  
  if (!hasRole('trabajador')) {
    return <Redirect to="/login" />;
  }
  
  const getJobTitle = (jobId: string) => {
    const job = jobService.getJobById(jobId);
    return job ? job.titulo : 'Oferta no disponible';
  };
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Portal del trabajador</h1>
        <p className="text-gray-500 mt-1">Bienvenido/a, {currentUser?.nombre}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Procesos internos activos</CardTitle>
            </CardHeader>
            <CardContent>
              {availableJobs.length > 0 ? (
                <div className="grid gap-6">
                  {availableJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay procesos internos activos en este momento</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mis participaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {myApplications.length > 0 ? (
                <div className="space-y-4">
                  {myApplications.slice(0, 5).map(application => (
                    <div key={application.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{getJobTitle(application.jobId)}</h3>
                        <StatusBadge status={application.estado} />
                      </div>
                      <p className="text-sm text-gray-500">
                        Fecha: {new Date(application.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {myApplications.length > 5 && (
                    <div className="text-center mt-4">
                      <Link to="/trabajadores/participaciones" className="text-sm text-hrm-blue hover:underline">
                        Ver todas las participaciones
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aún no has participado en ningún proceso</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Enlaces rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/chat" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  Chat con RRHH
                </Link>
                <Link to="/trabajadores/documentos" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  Mis documentos
                </Link>
                <Link to="/trabajadores/formacion" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  Catálogo de formación
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
