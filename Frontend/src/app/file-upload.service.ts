import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseUrl = 'insert-valid-http-address-here';

  constructor(private http: HttpClient ) { }

  // add error handling
  uploadPdf(firstName: string, lastName: string, mail: string, pdfFile: File): Observable<any> {
    const formData = new FormData();
    formData.append("Firstname", firstName);
    formData.append("Lastname", lastName);
    formData.append("Mail", mail);
    formData.append("PdfFile", pdfFile, pdfFile.name);

    return this.http.post(this.baseUrl, formData);

  }

}
