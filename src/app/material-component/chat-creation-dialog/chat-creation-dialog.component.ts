import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-chat-creation-dialog',
  templateUrl: './chat-creation-dialog.component.html',
  styleUrls: ['./chat-creation-dialog.component.scss']
})
export class ChatCreationDialogComponent {

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato']; // this has to be changed for users list
  local_data:any = {
    name: '',
    description: '',
    participants: []
  }
  action:string;

  constructor(
    public dialogRef: MatDialogRef<ChatCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.action = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createChatRoom(){
    this.dialogRef.close({data: this.local_data});
  }

  deleteChatRoom(){
    this.dialogRef.close({data: this.action});
  }

}
