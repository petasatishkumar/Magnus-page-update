import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Employee, EmployeeService } from 'src/app/core/services/employee.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = '';

  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedEmployees: Employee[] = [];

  // Delete Modal
  showDeleteModal: boolean = false;
  employeeToDelete: Employee | null = null;

  // Edit Modal
  showEditModal: boolean = false;
  editEmp: any = {};
  editIndex: number = -1;
  editCities: string[] = [];

  skillsList = [
    'AWS', 'DevOps', 'Full Stack Developer', 'Middleware',
    'QA-Automation', 'WebServices'
  ];

  cityMap: { [key: string]: string[] } = {
    India: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    UK: ['London', 'Manchester', 'Birmingham', 'Leeds']
  };

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  private getEmployeeId(employee: any): any {
    return employee?._id ?? employee?.id;
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.allEmployees = employees;
        this.filteredEmployees = [...employees];
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (err) => console.error(err)
    });
  }

  // ---- Search ----
  search() {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      this.filteredEmployees = [...this.allEmployees];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    this.filteredEmployees = this.allEmployees.filter((emp) => {
      const searchableValues = [
        emp.firstName,
        emp.lastName,
        emp.mobile,
        emp.email,
        emp.gender,
        emp.dob,
        emp.country,
        emp.city,
        ...(emp.skills || [])
      ];

      return searchableValues.some((value) =>
        String(value || '').toLowerCase().includes(normalizedSearch)
      );
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  clear() {
    this.searchTerm = '';
    this.filteredEmployees = [...this.allEmployees];
    this.currentPage = 1;
    this.updatePagination();
  }

  // ---- Pagination ----
  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedEmployees = this.filteredEmployees.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  // ---- Delete ----
  confirmDelete(emp: Employee) {
    this.employeeToDelete = emp;
    this.showDeleteModal = true;
  }

  deleteEmployee() {
    const id = this.getEmployeeId(this.employeeToDelete);
    if (!id) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.employeeToDelete = null;
        this.loadEmployees();
      },
      error: (err) => console.error(err)
    });
  }

  updateEmployee() {
    const id = this.getEmployeeId(this.editEmp);
    if (!id) {
      return;
    }

    const payload = {
      first_name: this.editEmp.firstName,
      last_name: this.editEmp.lastName,
      mobile_no: this.editEmp.mobile,
      email_id: this.editEmp.email,
      gender: this.editEmp.gender,
      birth_date: this.editEmp.dob,
      country: this.editEmp.country,
      city: this.editEmp.otherCity ? this.editEmp.otherCityName : this.editEmp.city,
      course: (this.editEmp.skills || []).join(', ')
    };

    this.employeeService.updateEmployee(id, payload).subscribe({
      next: () => {
        this.showEditModal = false;
        this.loadEmployees();
      },
      error: (err) => console.error(err)
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  // ---- Edit ----
  editEmployee(emp: Employee) {
    this.editEmp = { ...emp, skills: [...(emp.skills || [])] };
    this.editCities = this.cityMap[this.editEmp.country] || [];
    this.showEditModal = true;
  }

  onEditCountryChange() {
    this.editEmp.city = '';
    this.editCities = this.cityMap[this.editEmp.country] || [];
  }

  onEditSkillChange(event: Event, skill: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.editEmp.skills = this.editEmp.skills || [];
    if (checked) {
      if (!this.editEmp.skills.includes(skill)) this.editEmp.skills.push(skill);
    } else {
      this.editEmp.skills = this.editEmp.skills.filter((s: string) => s !== skill);
    }
  }

  onEditMobileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '').slice(0, 10);
    this.editEmp.mobile = sanitizedValue;
    input.value = sanitizedValue;
  }



  cancelEdit() {
    this.showEditModal = false;
  }

  // ---- Navigate ----
  goToCreate() {
    this.router.navigate(['/create']);
  }

}
