export interface Employees {
  id?: string;
  email: string;
  name: string;
  password?: string;
  image?: string | null;
  role?: string;
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  isLocked?: boolean;
  hoursWorked?: number;
  hourlyRate?: number;
}
export interface UpdateUser {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
}
