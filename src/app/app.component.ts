import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ApiService } from './service/api.service';
import { BlobTokenRequestModel } from './models/BlobTokenRequestModel.model';
import { BlobFileUploadModel } from './models/BlobFileUploadModel.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public docLinks : any = [];
  public FileName : any = "Select File here";
  public IsUpload : boolean = false;
  private UserId : string = "ECB8BAF4-16E0-4C39-AB51-656CF4435BF8";
  constructor(private apiService : ApiService) {
    // this.apiService.get('Controller/action').subscribe(
    //   (response : any) => {
    //     console.log(response);
    //   },
    //   (error : any) => {
    //     console.error(error);
    //   }
    // )
  };

  TokenStr = "AzureToken";
  title="BlobFileupload";
  containerName = "images";
  accountName = "angularfilestorageazure";

  public ProcessFile(event : any) {
    const files = event.target.files[0];
    console.log(files)
  }

  public DeleteImage (name : string, handler: () => void){
    this.ContainerClass(this.TokenStr).deleteBlob(name).then(() => {
      handler();
    })
  }

  public uploadFile(File : Blob, name : string, Token: string,  handler:() => void) {
    const blob_address = this.ContainerClass(Token).getBlockBlobClient(name);
    console.log(blob_address);
    blob_address.uploadData(File, {blobHTTPHeaders:{blobContentType:File.type}}).then((response) => {
      console.log(response);
      handler();
    })
  }

  public async getAllFilesList() {
    const FilesList = this.ContainerClass(this.TokenStr).listBlobsFlat();
    for await (const file of FilesList) {
      this.docLinks.push(`.net/images/${file.name}?${this.TokenStr}`);
    }
  }

  private ContainerClass(TokenString : string) : ContainerClient {
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${this.TokenStr}`).getContainerClient(this.containerName);
  }

  PopUpFileUpload() {
    document.getElementById("fileID")?.click()
  }
  private generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
      const random = Math.random() * 16 | 0; // Generate a random number between 0 and 15
      const value = char === 'x' ? random : (random & 0x3) | 0x8; // Use 0x4 for version and 0x8 for variant
      return value.toString(16); // Convert to hexadecimal
    });
  }

  private SaveRecord() {
    
  }
}
