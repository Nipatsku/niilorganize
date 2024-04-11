import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    password: '',
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.testExistingAuth().then((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard'])
      }
    })
  }

  onSubmit() {
    const password = this.loginForm.value.password
    if (!password) return
    this.authService.login(password)
  }
}
