import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private storageKey = 'employees';

  getEmployees(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addEmployee(employee: any): void {
    const employees = this.getEmployees();
    employee.id = Date.now(); // unique id
    employees.push(employee);
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
  }

  updateEmployee(updatedEmp: any): void {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === updatedEmp.id);
    if (index !== -1) {
      employees[index] = updatedEmp;
      localStorage.setItem(this.storageKey, JSON.stringify(employees));
    }
  }

  deleteEmployee(id: number): void {
    const employees = this.getEmployees().filter(e => e.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
  }

}