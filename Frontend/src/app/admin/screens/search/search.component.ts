import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from 'src/app/core/services/employee.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchName: string = '';
  searchMobile: string = '';

  allEmployees: any[] = [];
  filteredEmployees: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pagedEmployees: any[] = [];

  // Delete Modal
  showDeleteModal: boolean = false;
  employeeToDelete: any = null;

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
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    // Always load fresh from localStorage
    this.allEmployees = this.employeeService.getEmployees();
    this.filteredEmployees = [...this.allEmployees];
    this.updatePagination();
  }

  // ---- Search ----
  search() {
    this.filteredEmployees = this.allEmployees.filter(emp => {
      const nameMatch =
        emp.firstName.toLowerCase().includes(this.searchName.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchName.toLowerCase());
      const mobileMatch = emp.mobile.includes(this.searchMobile);
      return (this.searchName ? nameMatch : true) && (this.searchMobile ? mobileMatch : true);
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  clear() {
    this.searchName = '';
    this.searchMobile = '';
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
  confirmDelete(emp: any) {
    this.employeeToDelete = emp;
    this.showDeleteModal = true;
  }

  deleteEmployee() {
    // Delete from localStorage via service
    this.employeeService.deleteEmployee(this.employeeToDelete.id);
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    // Reload from localStorage
    this.loadEmployees();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  // ---- Edit ----
  editEmployee(emp: any) {
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
    if (checked) {
      if (!this.editEmp.skills.includes(skill)) this.editEmp.skills.push(skill);
    } else {
      this.editEmp.skills = this.editEmp.skills.filter((s: string) => s !== skill);
    }
  }

  updateEmployee() {
    // Update in localStorage via service
    this.employeeService.updateEmployee({ ...this.editEmp });
    this.showEditModal = false;
    // Reload from localStorage
    this.loadEmployees();
  }

  cancelEdit() {
    this.showEditModal = false;
  }

  // ---- Navigate ----
  goToCreate() {
    this.router.navigate(['/admin/create']);
  }

}