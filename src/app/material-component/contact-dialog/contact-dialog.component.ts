import { Component, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html'
})
export class ContactDialogComponent {
  action:string;
  local_data:any;
  showError:boolean = false;
  typeOfContact: string;
  nameEmerg: string;
  phoneEmerg: number;
  nameOther: string;
  phoneOther: number;
  description: string;

  constructor(
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close({event: 'close'});
  }


  addEmergencyContact() {
    if (this.nameEmerg && this.phoneEmerg) {
      const dataToPass = {
        nameEmerg: this.nameEmerg,
        phoneEmerg: this.phoneEmerg,
      }
      this.dialogRef.close({event: this.typeOfContact, data: dataToPass});
    } else {
      this.showError = true;
    }
  }

  addOtherContact() {
    if (this.nameOther && this.phoneOther && this.description) {
      const dataToPass = {
        nameOther: this.nameOther,
        phoneOther: this.phoneOther,
        description: this.description
      }
      this.dialogRef.close({event: this.typeOfContact, data: dataToPass});
    } else {
      this.showError = true;
    }
  }

  changeType(value: MatSelectChange) {
    if (value.value === 'emergency') {
      this.nameOther = null;
      this.phoneOther = null;
      this.description = null;
      this.showError = false;
    } else if (value.value === 'other') {
      this.nameEmerg = null; 
      this.phoneEmerg = null;
      this.showError = false;
    }   
  }
}

