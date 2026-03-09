import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Correct credentials
  email: string = 'training@jalaacademy.com';
  password: string = 'jobprogram';

  // Bound to input fields
  enteredEmail: string = '';
  enteredPassword: string = '';

  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {
    // Check for empty fields
    if (!this.enteredEmail.trim() && !this.enteredPassword.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    if (!this.enteredEmail.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (!this.enteredPassword.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    // Check credentials
    if (
      this.enteredEmail === this.email &&
      this.enteredPassword === this.password
    ) {
      this.errorMessage = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }

}