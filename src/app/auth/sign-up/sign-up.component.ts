import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

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


  signUp(event: Event){
    // Create user in Firebase Authentication database 
    if(this.form.valid){
      const formValue = this.form.value;
      this.authService.signUp(formValue.email, formValue.password)
      .then(()=>{
        this.router.navigate(['/login'])
      })
    }
    
  }

  private buildForm(){
    // Creation of the registration formBuilder
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      buildingName: ['', [Validators.required]],
      buildingAddr: ['', [Validators.required]],
      adminName: ['', [Validators.required]],
      adminId: ['', [Validators.required]],
    })
  }

}
