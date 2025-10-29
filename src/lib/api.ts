import { BookingResult, Class, CreateBookingRequest, Student, StudentReport } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiClient {
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        if (data?.message) message = data.message;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      // No content
      return undefined as unknown as T;
    }

    return response.json() as Promise<T>;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return this.request<Student[]>("/students");
  }

  async getStudent(id: number): Promise<Student> {
    return this.request<Student>(`/students/${id}`);
  }

  async createStudent(student: {
    name: string;
    email?: string;
    phone?: string;
    planTypeId: number;
  }): Promise<Student> {
    return this.request<Student>("/students", {
      method: "POST",
      body: JSON.stringify(student),
    });
  }

  // Classes
  async getClasses(): Promise<Class[]> {
    return this.request<Class[]>("/classes");
  }

  async getAvailableClasses(): Promise<Class[]> {
    return this.request<Class[]>("/classes/available");
  }

  async createClass(input: {
    classTypeName: string;
    scheduledAt: string;
    durationMinutes: number;
    maxCapacity: number;
  }): Promise<Class> {
    return this.request<Class>("/classes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  // Bookings
  async createBooking(request: CreateBookingRequest): Promise<BookingResult> {
    return this.request<BookingResult>("/bookings", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async cancelBooking(bookingId: number, reason: string): Promise<void> {
    return this.request<void>(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  // Reports
  async getStudentReport(studentId: number): Promise<StudentReport> {
    return this.request<StudentReport>(`/bookings/students/${studentId}/report`);
  }
}

export const api = new ApiClient();