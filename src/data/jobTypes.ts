
import { JobType, ApplicationStatus } from "./mockData";

export interface JobPosting {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: JobType;
  fechaInicio: string;
  fechaFin: string;
  grupoDestinatario: string;
  requisitos: string[];
  ubicacion: string;
  codigoInterno: string;
  pdfBase?: string;
  entidadConvocante: string;
  createdBy?: string;
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
  jobId?: string; // For backwards compatibility
  userId?: string;
  fechaPostulacion: string;
  estado: ApplicationStatus;
  comentariosRRHH?: string;
  archivosAdjuntos?: string[];
  fecha?: string; // Added for compatibility with Application interface
}

// Interface para mensajes de notificación
export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  userId?: string;
}
