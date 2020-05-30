import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afa: AngularFireAuth
  ) { }

  signUp(email: string, password: string){
    // user registration in firebase
    return this.afa.createUserWithEmailAndPassword(email, password)
    .then((result)=>{
      const newUser = result;
      // send verification email
      newUser.user.sendEmailVerification()
      .then(()=>{
        console.log('email verification sent');
      }) 
    }).catch(error => {
      console.log(error);
    })
  }


  logIn(email: string, password: string){
    // user login with firebase auth
    return this.afa.signInWithEmailAndPassword(email, password);
  }


  getCurrentUser(){
    return this.afa.authState;
  }

  
  logOut(){
    return this.afa.signOut();
  }

}
