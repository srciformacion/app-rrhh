
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessCard } from "@/components/UI/ProcessCard";
import { JobType } from "@/data/mockData";
import { Workflow, CalendarCheck } from "lucide-react";

export default function Processes() {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | JobType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allProcesses = jobService.getAllJobs();
  const today = new Date().toISOString().split('T')[0];
  
  // Filter processes based on active status
  const filteredByStatus = filter === "all" 
    ? allProcesses 
    : filter === "active" 
      ? allProcesses.filter(job => job.fechaInicio <= today && job.fechaFin >= today)
      : allProcesses.filter(job => job.fechaFin < today);
  
  // Filter by process type
  const filteredByType = typeFilter === "all" 
    ? filteredByStatus 
    : filteredByStatus.filter(job => job.tipo === typeFilter);
  
  // Filter by search term
  const filteredProcesses = filteredByType.filter(job => 
    job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.entidadConvocante && job.entidadConvocante.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort by start date (newest first)
  const sortedProcesses = [...filteredProcesses].sort((a, b) => 
    new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
  );
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Workflow className="mr-2 h-8 w-8" /> 
          Procesos de selección
        </h1>
        <p className="text-gray-500 mt-1">Encuentra y aplica a procesos de selección activos</p>
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
                placeholder="Buscar por título, descripción o entidad"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {sortedProcesses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {sortedProcesses.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border shadow-sm">
          <CalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No hay procesos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No hay procesos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
