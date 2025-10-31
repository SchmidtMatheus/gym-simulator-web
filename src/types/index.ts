export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  planTypeName: string;
  isActive: boolean;
}

export interface PlanType {
  id: string;
  name: string;
  description?: string;
  classLimit: number;
}

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  intensityLevel?: number;
}

export interface Class {
  id: string;
  classTypeName: string;
  scheduledAt: string;
  durationMinutes: number;
  maxCapacity: number;
  currentParticipants: number;
  isActive: boolean;
  isCancelled: boolean;
}

export interface Booking {
  id: string;
  studentId: number;
  classId: number;
  status: BookingStatus;
  bookingDate: string;
  cancelledAt?: string;
  student?: Student;
  class?: Class;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  email: string;
  totalClassesThisMonth: number;
  mostFrequentClassTypes: ClassTypePreference[]
  reportDate: string;
}

export interface ClassTypePreference {
  classTypeId: string;
  classTypeName: string;
  percentage: number;
  bookingCount: number;
}

export interface CreateBookingRequest {
  studentId: string;
  classId: string;
}

export interface BookingResult {
  success: boolean;
  message: string;
  bookingId?: string;
}

export enum BookingStatus {
  Scheduled = 1,
  Attended = 2,
  Missed = 3,
  Cancelled = 4
}