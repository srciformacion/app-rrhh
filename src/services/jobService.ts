import { JobPosting, mockJobs, mockApplications, Application, JobType, ApplicationStatus } from '../data/mockData';

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
      mockApplications[appIndex] = {
        ...mockApplications[appIndex],
        estado: status
      };
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
    
    return newApplication;
  }
};
