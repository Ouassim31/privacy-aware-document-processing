import { FileUploadService } from './../file-upload.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applicant-response-form',
  templateUrl: './applicant-response-form.component.html',
  styleUrls: ['./applicant-response-form.component.scss']
})
export class ApplicantResponseFormComponent implements OnInit {
firstName: any;
lastName: any;
mailAddress: any;
file!: File;

  constructor(private _fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0];
  }

  uploadPdf (firstName: string, lastName: string, mailAddress: string, pdfFile: File): void {
    if(this.file) {
    this._fileUploadService.uploadPdf(firstName, lastName, mailAddress, pdfFile).subscribe(
      (response: any) => {
        let success = [];
        success.push(response);
        alert("File uploaded!");
      }, error => {
        console.log(error);
        alert("Error. File not uploaded.");
      }
      )
    } else {
      alert("Please upload a document.")

    }

  }

}
