import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// services
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    // services
    private authService: AuthService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }


  logIn(event: Event){
    // logging in with email and password
    if(this.loginForm.valid){
      const formValue = this.loginForm.value;
      this.authService.logIn(formValue.email, formValue.password)
      .then((result)=>{
        // email verification required
        if(result.user.emailVerified !== true){
          alert('por favor verifica el correo de la administración para ingresar')
        }else{
          this.router.navigate(['/'])
          console.log(result.user);
          
        }
      }).catch(error =>{
        // incorrect credentials logic
        alert('email o contraseña incorrectos');
      })
    }
  } 


  private buildForm(){
    // build the login in form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

}
