
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { useState } from "react";
import { jobService } from "@/services/jobService";
import { JobPosting, JobType } from "@/data/mockData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Workflow, CalendarCheck, ClipboardList, FilePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Processes() {
  const { hasRole } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | JobType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!hasRole('rrhh')) {
    return <Redirect to="/login" />;
  }
  
  const allJobs = jobService.getAllJobs();
  const today = new Date().toISOString().split('T')[0];
  
  // Filter jobs based on active status
  const filteredByStatus = filter === "all" 
    ? allJobs 
    : filter === "active" 
      ? allJobs.filter(job => job.fechaInicio <= today && job.fechaFin >= today)
      : allJobs.filter(job => job.fechaFin < today);
  
  // Filter by job type
  const filteredByType = typeFilter === "all" 
    ? filteredByStatus 
    : filteredByStatus.filter(job => job.tipo === typeFilter);
  
  // Filter by search term
  const filteredJobs = filteredByType.filter(job => 
    job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort by start date (newest first)
  const sortedJobs = [...filteredJobs].sort((a, b) => 
    new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
  );
  
  return (
    <MainLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Workflow className="mr-2 h-8 w-8" /> 
            Procesos de selección
          </h1>
          <p className="text-gray-500 mt-1">Gestión de todos los procesos activos e históricos</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/rrhh/procesos/nuevo">
              <FilePlus className="mr-2 h-4 w-4" /> Nuevo proceso
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Select value={filter} onValueChange={(value: "all" | "active" | "inactive") => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los procesos</SelectItem>
                  <SelectItem value="active">Procesos activos</SelectItem>
                  <SelectItem value="inactive">Procesos finalizados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Select value={typeFilter} onValueChange={(value: "all" | JobType) => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="publico">Procesos públicos</SelectItem>
                  <SelectItem value="interno">Procesos internos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Buscar por título o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Listado de procesos
            <span className="ml-2 text-sm text-gray-500">({sortedJobs.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedJobs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Grupo Destinatario</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedJobs.map((job) => {
                    const isActive = job.fechaInicio <= today && job.fechaFin >= today;
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.titulo}</TableCell>
                        <TableCell>
                          <Badge variant={job.tipo === "publico" ? "default" : "outline"}>
                            {job.tipo === "publico" ? "Público" : "Interno"}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.grupoDestinatario}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Inicio: {new Date(job.fechaInicio).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500">Fin: {new Date(job.fechaFin).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="bg-green-500">Activo</Badge>
                          ) : (
                            <Badge variant="secondary">Finalizado</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/rrhh/procesos/${job.id}`}>
                                Ver detalle
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <CalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No hay procesos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay procesos que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
