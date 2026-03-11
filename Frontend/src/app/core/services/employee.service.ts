import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface EmployeeApiPayload {
  first_name: string;
  last_name: string;
  mobile_no: string;
  email_id: string;
  gender: string;
  birth_date: string;
  country: string;
  city: string;
  course: string;
}

export interface EmployeeApiResponse extends EmployeeApiPayload {
  _id: string;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: string;
  dob: string;
  country: string;
  city: string;
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = 'http://127.0.0.1:8000/people';

  constructor(private http: HttpClient) { }

  private mapApiEmployee(employee: EmployeeApiResponse): Employee {
    return {
      _id: employee._id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      mobile: employee.mobile_no,
      email: employee.email_id,
      gender: employee.gender,
      dob: employee.birth_date,
      country: employee.country,
      city: employee.city,
      skills: employee.course
        ? employee.course.split(',').map((skill) => skill.trim()).filter(Boolean)
        : []
    };
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<EmployeeApiResponse[]>(this.apiUrl).pipe(
      map((employees) => employees.map((employee) => this.mapApiEmployee(employee)))
    );
  }

  addEmployee(employee: EmployeeApiPayload): Observable<any> {
    return this.http.post(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: EmployeeApiPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
