import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ApiService } from './service/api.service';
import { BlobTokenRequestModel, TokenTypes } from './models/BlobTokenRequestModel.model';
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
  containerName = "pentechs";
  accountName = "pendevfilestorage";

  public ProcessFile(event : any) {
    const files = event.target.files[0];
    console.log(files);
    const UploadFileName = `${this.generateGUID()}.${files.name.toString().split('.')[1]}`;
    let PostObj = new BlobTokenRequestModel();
    PostObj.TokenType = TokenTypes.UploadOrCreate;
    PostObj.FileName = null;
    this.apiService.post('api/Token/Generate', PostObj).subscribe(
      (response : any) => {
          this.uploadFile(files, UploadFileName, response.Token, () => {
            console.log("Files are UPloaded");

          });
      },
      (error : any) => {
        console.error(error);
      }
    )
    // this.uploadFile(files, UploadFileName, () => {
    //   console.log("Files are UPloaded")
    // })
    // uploadFile(files)
  }

  public DeleteImage (name : string, handler: () => void){
    this.ContainerClass(this.TokenStr).deleteBlob(name).then(() => {
      handler();
    })
  }

  public uploadFile(File : Blob, name : string, Token: string,  handler:() => void) {
    const blob_address = this.ContainerClass(Token).getBlockBlobClient(name);
    blob_address.uploadData(File, {blobHTTPHeaders:{blobContentType:File.type}}).then((response) => {
      console.log(response);
      handler();
    })
  }

  public async getAllFilesList(TokenStr : string) {
    const FilesList = this.ContainerClass(TokenStr).listBlobsFlat();
    for await (const file of FilesList) {
      console.log(`https://${this.accountName}.blob.core.windows.net/${this.containerName}/${file.name}${TokenStr}`);
      this.docLinks.push(`https://${this.accountName}.blob.core.windows.net/${this.containerName}/${file.name}${TokenStr}`);
    }
  }

  private ContainerClass(TokenString : string) : ContainerClient {
    console.log(`https://${this.accountName}.blob.core.windows.net?${TokenString}`);
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net${TokenString}`).getContainerClient(this.containerName);
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

  public LoadImages() {
    let PostObj = new BlobTokenRequestModel();
    PostObj.TokenType = TokenTypes.List;
    PostObj.FileName = null;
    this.apiService.post('api/Token/Generate', PostObj).subscribe(
      (response : any) => {
        this.getAllFilesList(response.Token);
      },
      (error : any) => {
        console.error(error);
      }
    )
  }
  private SaveRecord() {
    
  }
}
