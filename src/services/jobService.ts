
import { JobPosting, Application } from '../data/types';
import { mockJobs } from '../data/mockJobs';
import { mockApplications } from '../data/mockApplications';
import { userService } from './userService';

export const jobService = {
  // Get all jobs
  getAllJobs: (): JobPosting[] => {
    return [...mockJobs];
  },

  // Get job by id
  getJobById: (jobId: string): JobPosting | undefined => {
    return mockJobs.find(job => job.id === jobId);
  },

  // Get active jobs (where current date is between fechaInicio and fechaFin)
  getActiveJobs: (): JobPosting[] => {
    const today = new Date().toISOString().split('T')[0];
    return mockJobs.filter(job => 
      job.fechaInicio <= today && job.fechaFin >= today
    );
  },

  // Get internal jobs
  getInternalJobs: (): JobPosting[] => {
    return mockJobs.filter(job => job.tipo === 'interno');
  },

  // Get public jobs
  getPublicJobs: (): JobPosting[] => {
    return mockJobs.filter(job => job.tipo === 'publico');
  },

  // Get active public jobs (new method)
  getActivePublicJobs: (): JobPosting[] => {
    const today = new Date().toISOString().split('T')[0];
    return mockJobs.filter(job => 
      job.tipo === 'publico' && job.fechaInicio <= today && job.fechaFin >= today
    );
  },

  // Get active internal jobs (new method)
  getActiveInternalJobs: (): JobPosting[] => {
    const today = new Date().toISOString().split('T')[0];
    return mockJobs.filter(job => 
      job.tipo === 'interno' && job.fechaInicio <= today && job.fechaFin >= today
    );
  },

  // Get applications for a specific job
  getJobApplications: (jobId: string): Application[] => {
    return mockApplications.filter(app => app.jobId === jobId);
  },

  // Get application by id
  getApplicationById: (applicationId: string): Application | undefined => {
    return mockApplications.find(app => app.id === applicationId);
  },

  // Get applications by user id
  getUserApplications: (userId: string): Application[] => {
    return mockApplications.filter(app => app.userId === userId);
  },

  // Create or update job application (in a real app, this would call an API)
  saveApplication: (application: Partial<Application> & { userId: string; jobId: string }): Application => {
    const existingAppIndex = mockApplications.findIndex(app => 
      app.userId === application.userId && app.jobId === application.jobId
    );
    
    if (existingAppIndex !== -1) {
      // Update existing application
      mockApplications[existingAppIndex] = {
        ...mockApplications[existingAppIndex],
        ...application
      };
      return mockApplications[existingAppIndex];
    } else {
      // Create new application
      const newApp: Application = {
        id: (mockApplications.length + 1).toString(),
        userId: application.userId,
        jobId: application.jobId,
        estado: application.estado || 'pendiente',
        fecha: application.fecha || new Date().toISOString().split('T')[0],
        ...application
      };
      
      mockApplications.push(newApp);
      return newApp;
    }
  },

  // Update application status
  updateApplicationStatus: (applicationId: string, status: 'pendiente' | 'aprobado' | 'rechazado', comments?: string): Application | undefined => {
    const appIndex = mockApplications.findIndex(app => app.id === applicationId);
    if (appIndex === -1) return undefined;
    
    mockApplications[appIndex] = {
      ...mockApplications[appIndex],
      estado: status,
      comentariosRRHH: comments || mockApplications[appIndex].comentariosRRHH
    };
    
    return mockApplications[appIndex];
  },

  // Get job applications grouped by status
  getApplicationsByStatus: (jobId: string) => {
    const applications = mockApplications.filter(app => app.jobId === jobId);
    
    // Enrich applications with user data
    const enrichedApplications = applications.map(app => {
      const user = userService.getUserById(app.userId);
      return {
        ...app,
        user
      };
    });
    
    return {
      pendientes: enrichedApplications.filter(app => app.estado === 'pendiente'),
      aprobados: enrichedApplications.filter(app => app.estado === 'aprobado'),
      rechazados: enrichedApplications.filter(app => app.estado === 'rechazado')
    };
  },

  // For compatibility with JobApplication interface in some components
  mapApplicationToJobApplication: (application: Application) => {
    const user = userService.getUserById(application.userId);
    if (!user) return null;
    
    return {
      id: application.id,
      nombre: user.nombre,
      apellidos: user.apellidos || '',
      email: user.email,
      telefono: user.telefono,
      experiencia: application.experiencia || '',
      motivacion: application.motivacion || '',
      cvFile: null,
      otrosDocumentos: null,
      processId: application.jobId,
      jobId: application.jobId,
      userId: application.userId,
      fechaPostulacion: application.fecha,
      estado: application.estado,
      comentariosRRHH: application.comentariosRRHH,
      archivosAdjuntos: application.archivosAdjuntos || [],
      fecha: application.fecha
    };
  },

  // Create a new job
  createJob: (jobData: Partial<JobPosting>): JobPosting => {
    const newJob: JobPosting = {
      id: (mockJobs.length + 1).toString(),
      titulo: jobData.titulo || "",
      descripcion: jobData.descripcion || "",
      tipo: jobData.tipo || "publico",
      grupoDestinatario: jobData.grupoDestinatario || "",
      fechaInicio: jobData.fechaInicio || new Date().toISOString().split('T')[0],
      fechaFin: jobData.fechaFin || new Date().toISOString().split('T')[0],
      requisitos: jobData.requisitos || [],
      createdBy: jobData.createdBy || "",
      ubicacion: jobData.ubicacion,
      codigoInterno: jobData.codigoInterno,
      entidadConvocante: jobData.entidadConvocante,
      pdfBase: jobData.pdfBase
    };

    mockJobs.push(newJob);
    return newJob;
  }
};

// Export applicationService as an alias to jobService for backward compatibility
export const applicationService = {
  getApplicationById: jobService.getApplicationById,
  getApplicationsByJobId: jobService.getJobApplications,
  getUserApplications: jobService.getUserApplications,
  updateApplicationStatus: jobService.updateApplicationStatus,
  submitJobApplication: (data: any) => {
    // Map the data from JobApplication format to Application format
    const application: Partial<Application> & { userId: string; jobId: string } = {
      userId: data.userId || "",
      jobId: data.processId || "",
      estado: "pendiente",
      fecha: new Date().toISOString().split('T')[0],
      motivacion: data.motivacion,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      experiencia: data.experiencia
    };
    
    return jobService.saveApplication(application);
  }
};
