
// This file is maintained for backwards compatibility
// and re-exports all data from the new modular files

import { 
  UserRole, JobType, ApplicationStatus, ContactPreference,
  User, JobPosting, Application, ChatMessage 
} from './types';

import { mockUsers } from './mockUsers';
import { mockJobs } from './mockJobs';
import { mockApplications } from './mockApplications';
import { mockChatMessages } from './mockMessages';

// Re-export the types
export type { UserRole, JobType, ApplicationStatus, ContactPreference };
export type { User, JobPosting, Application, ChatMessage };

// Re-export the mock data
export { mockUsers, mockJobs, mockApplications, mockChatMessages };
