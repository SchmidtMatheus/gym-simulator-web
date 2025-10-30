export interface Student {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  planTypeName: string;
  isActive: boolean;
}

export interface PlanType {
  id: number;
  name: string;
  description?: string;
  monthlyClassLimit: number;
}

export interface ClassType {
  id: number;
  name: string;
  description?: string;
  intensityLevel?: number;
}

export interface Class {
  id: number;
  classTypeName: string;
  scheduledAt: string;
  durationMinutes: number;
  maxCapacity: number;
  currentParticipants: number;
  isActive: boolean;
  isCancelled: boolean;
}

export interface Booking {
  id: number;
  studentId: number;
  classId: number;
  status: BookingStatus;
  bookingDate: string;
  cancelledAt?: string;
  student?: Student;
  class?: Class;
}

export interface StudentReport {
  studentId: number;
  studentName: string;
  planType: string;
  monthlyClassLimit: number;
  currentMonthClasses: number;
  remainingClasses: number;
  currentMonthYear: string;
  topClassTypes: string[];
}

export interface CreateBookingRequest {
  studentId: number;
  classId: number;
}

export interface BookingResult {
  success: boolean;
  message: string;
  bookingId?: number;
}

export enum BookingStatus {
  Scheduled = 1,
  Attended = 2,
  Missed = 3,
  Cancelled = 4
}