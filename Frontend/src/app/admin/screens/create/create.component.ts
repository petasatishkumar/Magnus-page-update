import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

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
  ) {}

  onCountryChange() {
    this.employee.city = '';
    this.cities = this.cityMap[this.employee.country] || [];
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
    this.employeeService.addEmployee({ ...this.employee });
    this.router.navigate(['/search']);

  }

  cancel() {
    window.location.reload();
  }

}