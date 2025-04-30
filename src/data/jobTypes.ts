
import { JobType, ApplicationStatus } from "./mockData";

// Extendemos el tipo JobPosting para incluir las propiedades faltantes
export interface JobPosting {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: JobType;
  fechaInicio: string;
  fechaFin: string;
  grupoDestinatario: string;
  requisitos: string[];
  ubicacion?: string;
  codigoInterno?: string;
  pdfBase?: string;
  entidadConvocante?: string;
}

// Modelo para la postulación a un proceso
export interface JobApplication {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  experiencia: string;
  motivacion: string;
  cvFile?: File | null;
  otrosDocumentos?: File[] | null;
  processId: string;
  userId?: string;
  fechaPostulacion: string;
  estado: ApplicationStatus;
}
