
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { DashboardCard } from "@/components/UI/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { mockApplications, mockJobs } from "@/data/mockData";
import { userService } from "@/services/userService";
import { Users, Award, FileCheck, Building2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function RRHHDashboard() {
  const { hasRole } = useAuth();
  
  if (!hasRole('rrhh')) {
    return <Redirect to="/login" />;
  }
  
  const activeJobs = mockJobs.filter(job => {
    const now = new Date().toISOString().split('T')[0];
    return job.fechaInicio <= now && job.fechaFin >= now;
  });
  
  const pendingApplications = mockApplications.filter(app => app.estado === 'pendiente');
  const workers = userService.getWorkers();
  
  const recentApplications = [...mockApplications]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de control RRHH</h1>
        <p className="text-gray-500 mt-1">Resumen de actividad y estadísticas</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard 
          title="Procesos activos" 
          value={activeJobs.length} 
          icon={<Award className="h-5 w-5" />} 
        />
        <DashboardCard 
          title="Candidaturas pendientes" 
          value={pendingApplications.length}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 12, label: "vs. mes anterior" }}
        />
        <DashboardCard 
          title="Trabajadores activos" 
          value={workers.length}
          icon={<Users className="h-5 w-5" />}
        />
        <DashboardCard 
          title="Departamentos" 
          value={3}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Procesos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.slice(0, 5).map(job => (
                <Link to={`/rrhh/procesos/${job.id}`} key={job.id} className="block">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{job.titulo}</h3>
                      <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {job.tipo === 'publico' ? 'Público' : 'Interno'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{job.grupoDestinatario}</span>
                      <span>Hasta: {new Date(job.fechaFin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
              {activeJobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay procesos activos actualmente
                </div>
              )}
              <div className="text-center mt-4">
                <Link to="/rrhh/procesos" className="text-sm text-hrm-blue hover:underline">
                  Ver todos los procesos
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Candidaturas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map(application => {
                const applicant = userService.getUserById(application.userId);
                const job = mockJobs.find(j => j.id === application.jobId);
                
                return (
                  <Link to={`/rrhh/candidaturas/${application.id}`} key={application.id} className="block">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                            {applicant?.avatarUrl ? (
                              <img src={applicant.avatarUrl} alt={applicant.nombre} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {applicant?.nombre.charAt(0)}
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium">{applicant?.nombre}</h3>
                        </div>
                        <StatusBadge status={application.estado} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{job?.titulo}</span>
                        <span>{new Date(application.fecha).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {recentApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay candidaturas recientes
                </div>
              )}
              <div className="text-center mt-4">
                <Link to="/rrhh/candidaturas" className="text-sm text-hrm-blue hover:underline">
                  Ver todas las candidaturas
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
