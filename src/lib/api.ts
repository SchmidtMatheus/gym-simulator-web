import { Booking, BookingResult, Class, CreateBookingRequest, PlanType, Student, StudentReport } from "@/types";
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
        const data = await response.json();
        if (data?.message) message = data.message;
      throw new Error(message);
    }

    const text = await response.text();
    if (!text) return {} as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }


  // Students
  async getStudents(page: number = 1, pageSize: number = 10): Promise<{ items: Student[], totalCount: number, pageNumber: number, pageSize: number }> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })
    return this.request(`/students?${params.toString()}`);
  }

  async getStudent(id: string): Promise<Student> {
    return this.request<Student>(`/students/${id}`);
  }

  async createStudent(student: {
    name: string;
    email?: string;
    phone?: string;
    planTypeId: string;
  }): Promise<Student> {
    return this.request<Student>("/students", {
      method: "POST",
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: string, student: {
    name: string;
    email?: string;
    phone?: string;
    planTypeId: string;
    isActive?: boolean;
  }): Promise<Student> {
    return this.request<Student>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(student),
    });
  }

  // Classes
  async getClasses(page: number = 1, pageSize: number = 10): Promise<{ items: Class[], totalCount: number, pageNumber: number, pageSize: number }> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })
    return this.request(`/classes?${params.toString()}`);
  }

  async getAvaliableClasses(page: number = 1, pageSize: number = 10): Promise<{ items: Class[], totalCount: number, pageNumber: number, pageSize: number }> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })
    return this.request(`/classes/list/available?${params.toString()}`);
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
      body: JSON.stringify(input)
    });
  }

  // Bookings
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    return this.request<Booking>("/bookings", {
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
  async createPlanType(data: { name: string; description?: string, classLimit: number }): Promise<PlanType> {
    return this.request<PlanType>("/plan-types", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async updatePlanType(id: string, data: { name: string; description?: string, classLimit: number }): Promise<PlanType> {
    return this.request<PlanType>(`/plan-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  async deletePlanType(id: string): Promise<void> {
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
  async updateClassType(id: string, data: { name: string; description?: string, classLimit: number }): Promise<AppClassType> {
    return this.request<AppClassType>(`/class-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  async deleteClassType(id: string): Promise<void> {
    return this.request<void>(`/class-types/${id}`, { method: "DELETE" });
  }

  // Reports
  async getStudentReport(studentId: string): Promise<StudentReport> {
    return this.request<StudentReport>(`/students/${studentId}/report`);
  }
}

export const api = new ApiClient();