import { Component, OnInit } from '@angular/core';
import { FecthDataService } from 'app/core/services/fecth-data.service';
import { HoldDataService } from 'app/core/services/hold-data.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  user:any;
  residents :any = [];
  keyChats:any;
  data:any;
  constructor(private fecthDataService:FecthDataService,
    private holdData:HoldDataService,
    private router: Router,
    ) { 
    this.user= this.holdData.userInfo
    console.log(this.user);
    
    this.fecthDataService.getResidentsDirectory(this.user.activeBuilding).subscribe( res => {
      this.residents = res
      this.data=true;
      console.log(this.residents);
    });
  }

  ngOnInit(): void {
    console.log("sadlkfjh");
    
  }
  chat(person){
    console.log(person);
    
    // verifying the user already have a conversation with the person
   this.fecthDataService.getPrivateChatKey(this.user.userId,person.userId).subscribe( res => {
     this.keyChats = res
     console.log(res);
    //  if(this.keyChats === undefined ){
    //    //they don't have a previous conversation so create one
    //    let navigationExtras: NavigationExtras = {
    //      state: {
    //        person: person
    //      }
    //    };
    //    this.router.navigate(['privatechat'], navigationExtras);
    //    console.log('me fui por aqui');
       
    //  }else{
    //    let navigationExtras: NavigationExtras = {
    //      state: {
    //        chatInfo: this.keyChats
    //      }
    //    };
    //    //they already have a conversation so redirect to the chat
    //    this.router.navigate(['privatechat'], navigationExtras);
    //    console.log('me fui por aca');

    //  }
   });
   
 }
}
