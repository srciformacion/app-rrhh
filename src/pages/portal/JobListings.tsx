
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { JobCard } from "@/components/UI/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const activePublicJobs = jobService.getActivePublicJobs();
  
  const filteredJobs = activePublicJobs.filter(job => 
    job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.grupoDestinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requisitos.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Portal de Empleo</h1>
        <p className="text-gray-500 mt-1">Encuentra y postúlate para nuestras ofertas abiertas</p>
      </div>
      
      <div className="mb-8">
        <div className="flex gap-4 max-w-xl">
          <div className="flex-grow relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título, descripción o requisitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="shrink-0"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>
      
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-medium text-gray-600 mb-3">No hay ofertas disponibles</h3>
          <p className="text-gray-500">
            No se encontraron ofertas que coincidan con tu búsqueda. Intenta con otros términos o vuelve más tarde.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
