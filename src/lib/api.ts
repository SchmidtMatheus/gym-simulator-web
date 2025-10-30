import { BookingResult, Class, CreateBookingRequest, PlanType, Student, StudentReport } from "@/types";
import { ClassType as AppClassType } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5218/api";

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
  async getStudents(page: number = 1, pageSize: number = 10): Promise<{ items: Student[], totalCount: number, pageNumber: number, pageSize: number }> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })
    return this.request(`/students?${params.toString()}`);
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
    classTypeId?: string;
    classTypeName?: string;
    scheduledAt: string;
    durationMinutes: number;
    maxCapacity: number;
    isActive?: boolean;
  }): Promise<Class> {
    return this.request<Class>("/classes", {
      method: "POST",
      body: JSON.stringify({ dto: input })
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

  // Bookings (novo, paginado)
  async getBookings(page: number = 1, pageSize: number = 10): Promise<{ data: BookingResult[], totalCount: number, pageNumber: number, pageSize: number }> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })
    return this.request(`/bookings?${params.toString()}`);
  }

  // PlanTypes
  async getPlanTypes(): Promise<PlanType[]> {
    return this.request<PlanType[]>("/plan-types");
  }
  async createPlanType(data: { name: string; description?: string }): Promise<PlanType> {
    return this.request<PlanType>("/plan-types", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async updatePlanType(id: number, data: { name: string; description?: string }): Promise<PlanType> {
    return this.request<PlanType>(`/plan-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  async deletePlanType(id: number): Promise<void> {
    return this.request<void>(`/plan-types/${id}`, { method: "DELETE" });
  }

  // ClassTypes
  async getClassTypes(): Promise<AppClassType[]> {
    return this.request<AppClassType[]>("/class-types");
  }
  async createClassType(data: { name: string; description?: string }): Promise<AppClassType> {
    return this.request<AppClassType>("/class-types", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async updateClassType(id: number, data: { name: string; description?: string }): Promise<AppClassType> {
    return this.request<AppClassType>(`/class-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  async deleteClassType(id: number): Promise<void> {
    return this.request<void>(`/class-types/${id}`, { method: "DELETE" });
  }
}

export const api = new ApiClient();