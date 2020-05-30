import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../core/services/auth.service';
import { SetDataService } from '../../core/services/set-data.service';
import { AngularFireAuth } from '@angular/fire/auth';



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
    private afa: AngularFireAuth,
    // services
    private authService: AuthService,
    private setDataService: SetDataService
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
        // get last registered user from firebase Auth
        this.afa.onAuthStateChanged((user)=>{
          if(user){
            const buildingData = {
              name: this.form.get('buildingName').value,
              address: this.form.get('buildingAddr').value,
            }
    
            const adminData = {
              name: this.form.get('adminName').value,
              id: this.form.get('adminId').value,
              email: this.form.get('email').value,
            }
          
            
            this.setDataService.setNewBuilding(buildingData, adminData, user.uid);
            this.router.navigate(['/auth/login'])
          }
        })
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
