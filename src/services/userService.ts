
import { User, mockUsers, UserRole } from '../data/mockData';

export const userService = {
  // Get all users
  getAllUsers: (): User[] => {
    return [...mockUsers];
  },

  // Get user by id
  getUserById: (userId: string): User | undefined => {
    return mockUsers.find(user => user.id === userId);
  },

  // Get users by role
  getUsersByRole: (role: UserRole): User[] => {
    return mockUsers.filter(user => user.rol === role);
  },

  // Get RRHH users
  getRRHHUsers: (): User[] => {
    return mockUsers.filter(user => user.rol === 'rrhh');
  },

  // Get workers
  getWorkers: (): User[] => {
    return mockUsers.filter(user => user.rol === 'trabajador');
  },

  // Get applicants
  getApplicants: (): User[] => {
    return mockUsers.filter(user => user.rol === 'solicitante');
  },

  // Create or update a user (in a real app, this would call an API)
  saveUser: (user: Partial<User> & { email: string }): User => {
    const existingUserIndex = mockUsers.findIndex(u => u.email === user.email);
    
    if (existingUserIndex !== -1) {
      // Update existing user
      mockUsers[existingUserIndex] = {
        ...mockUsers[existingUserIndex],
        ...user
      };
      return mockUsers[existingUserIndex];
    } else {
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        nombre: user.nombre || '',
        email: user.email,
        telefono: user.telefono || '',
        rol: user.rol || 'solicitante',
        ...user
      };
      
      mockUsers.push(newUser);
      return newUser;
    }
  }
};
