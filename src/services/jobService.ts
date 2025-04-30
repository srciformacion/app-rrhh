
import { JobPosting, mockJobs, mockApplications, Application, JobType, ApplicationStatus } from '../data/mockData';
import { JobApplication } from '../data/jobTypes';
import { notificationService } from './notificationService';

export const jobService = {
  // Get all job postings
  getAllJobs: (): JobPosting[] => {
    return [...mockJobs];
  },

  // Get jobs by type (public or internal)
  getJobsByType: (type: JobType): JobPosting[] => {
    return mockJobs.filter(job => job.tipo === type);
  },

  // Get job by id
  getJobById: (jobId: string): JobPosting | undefined => {
    return mockJobs.find(job => job.id === jobId);
  },

  // Get active jobs (where current date is between start and end date)
  getActiveJobs: (): JobPosting[] => {
    const now = new Date().toISOString().split('T')[0];
    return mockJobs.filter(job => 
      job.fechaInicio <= now && job.fechaFin >= now
    );
  },

  // Get active public jobs
  getActivePublicJobs: (): JobPosting[] => {
    const activeJobs = jobService.getActiveJobs();
    return activeJobs.filter(job => job.tipo === 'publico');
  },

  // Get active internal jobs
  getActiveInternalJobs: (): JobPosting[] => {
    const activeJobs = jobService.getActiveJobs();
    return activeJobs.filter(job => job.tipo === 'interno');
  },

  // Create a new job (in a real app, this would call an API)
  createJob: (job: Omit<JobPosting, 'id'>): JobPosting => {
    const newJob: JobPosting = {
      ...job,
      id: (mockJobs.length + 1).toString(),
    };
    
    // In a real app, this would send a request to an API
    mockJobs.push(newJob);
    
    return newJob;
  }
};

export const applicationService = {
  // Get all applications
  getAllApplications: (): Application[] => {
    return [...mockApplications];
  },

  // Get application by id
  getApplicationById: (applicationId: string): Application | undefined => {
    return mockApplications.find(app => app.id === applicationId);
  },

  // Get applications by job id
  getApplicationsByJobId: (jobId: string): Application[] => {
    return mockApplications.filter(app => app.jobId === jobId);
  },

  // Get applications by user id
  getApplicationsByUserId: (userId: string): Application[] => {
    return mockApplications.filter(app => app.userId === userId);
  },

  // Update application status
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus): Application | undefined => {
    const appIndex = mockApplications.findIndex(app => app.id === applicationId);
    
    if (appIndex !== -1) {
      const prevStatus = mockApplications[appIndex].estado;
      mockApplications[appIndex] = {
        ...mockApplications[appIndex],
        estado: status
      };
      
      // Crear notificación para el usuario y administrador
      const application = mockApplications[appIndex];
      const job = jobService.getJobById(application.jobId);
      
      // Notificación para el usuario que aplicó
      if (application.userId) {
        let title = "";
        let message = "";
        let type: "info" | "success" | "warning" | "error" = "info";
        
        switch (status) {
          case "aprobado":
            title = "¡Felicitaciones!";
            message = `Tu candidatura para "${job?.titulo}" ha sido aprobada.`;
            type = "success";
            break;
          case "rechazado":
            title = "Candidatura no seleccionada";
            message = `Tu candidatura para "${job?.titulo}" no ha sido seleccionada en esta ocasión.`;
            type = "warning";
            break;
          case "pendiente":
            title = "Estado actualizado";
            message = `Tu candidatura para "${job?.titulo}" ha sido marcada como pendiente de revisión.`;
            type = "info";
            break;
        }
        
        notificationService.createNotification(title, message, type, application.userId);
      }
      
      // Notificación para el administrador que cambió el estado
      const adminMessage = `El estado de la candidatura #${applicationId} ha cambiado de ${prevStatus} a ${status}`;
      notificationService.createNotification("Estado de candidatura actualizado", adminMessage, "info");
      
      return mockApplications[appIndex];
    }
    
    return undefined;
  },

  // Create a new application
  createApplication: (application: Omit<Application, 'id'>): Application => {
    const newApplication: Application = {
      ...application,
      id: (mockApplications.length + 1).toString(),
    };
    
    // In a real app, this would send a request to an API
    mockApplications.push(newApplication);
    
    // Notificar a administradores sobre la nueva aplicación
    notificationService.createNotification(
      "Nueva candidatura recibida", 
      `Se ha recibido una nueva candidatura para el proceso "${jobService.getJobById(newApplication.jobId)?.titulo}"`,
      "info"
    );
    
    return newApplication;
  },
  
  // Crear una nueva postulación al proceso
  submitJobApplication: (application: Omit<JobApplication, 'id' | 'estado' | 'fechaPostulacion'>): JobApplication => {
    const newApplication: JobApplication = {
      ...application,
      id: (Math.floor(Math.random() * 10000) + 1).toString(),
      estado: 'pendiente',
      fechaPostulacion: new Date().toISOString()
    };
    
    // En una aplicación real, esto enviaría una solicitud a una API
    console.log('Nueva postulación recibida:', newApplication);
    
    // Notificar a administradores
    notificationService.createNotification(
      "Nueva postulación recibida",
      `Se ha recibido una nueva postulación para el proceso "${application.processId}"`,
      "info"
    );
    
    return newApplication;
  }
};
