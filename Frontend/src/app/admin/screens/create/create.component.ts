import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  isSubmitted = false;
  apiError = '';
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  employee = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: 'Male',
    address: '',
    country: '',
    city: '',
    otherCity: false,
    otherCityName: '',
    skills: [] as string[]
  };

  skillsList = [
    'AWS', 'DevOps', 'Full Stack Developer', 'Middleware',
    'QA-Automation', 'WebServices'
  ];

  cityMap: { [key: string]: string[] } = {
    India: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    UK: ['London', 'Manchester', 'Birmingham', 'Leeds']
  };

  cities: string[] = [];

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  get selectedCity(): string {
    return this.employee.otherCity ? this.employee.otherCityName.trim() : this.employee.city;
  }

  get isFormValid(): boolean {
    return !!(
      this.employee.firstName.trim() &&
      this.employee.lastName.trim() &&
      this.employee.email.trim() &&
      this.hasValidEmail &&
      this.employee.mobile.length === 10 &&
      this.employee.dob &&
      this.employee.gender &&
      this.employee.address.trim() &&
      this.employee.country &&
      this.selectedCity
    );
  }

  get hasValidEmail(): boolean {
    return this.emailPattern.test(this.employee.email.trim());
  }

  onCountryChange() {
    this.employee.city = '';
    this.employee.otherCity = false;
    this.employee.otherCityName = '';
    this.cities = this.cityMap[this.employee.country] || [];
  }

  onCityChange() {
    if (this.employee.city) {
      this.employee.otherCity = false;
      this.employee.otherCityName = '';
    }
  }

  onOtherCityToggle() {
    if (this.employee.otherCity) {
      this.employee.city = '';
    } else {
      this.employee.otherCityName = '';
    }
  }

  onMobileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '').slice(0, 10);
    this.employee.mobile = sanitizedValue;
    input.value = sanitizedValue;
  }

  onSkillChange(event: Event, skill: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.employee.skills.push(skill);
    } else {
      this.employee.skills = this.employee.skills.filter(s => s !== skill);
    }
  }

  save() {
    this.isSubmitted = true;
    this.apiError = '';

    if (!this.isFormValid) {
      return;
    }

    const payload = {
      first_name: this.employee.firstName.trim(),
      last_name: this.employee.lastName.trim(),
      mobile_no: this.employee.mobile,
      email_id: this.employee.email.trim(),
      gender: this.employee.gender,
      birth_date: this.employee.dob,
      country: this.employee.country,
      city: this.selectedCity,
      course: this.employee.skills?.join(', ')
    };

    this.employeeService.addEmployee(payload).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.apiError = err?.error?.detail || 'Unable to save employee details.';
        console.error(err);
      }
    });
  }

  cancel() {
    window.location.reload();
  }

}
