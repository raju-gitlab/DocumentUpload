import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ApiService } from './service/api.service';
import { BlobTokenRequestModel, TokenTypes } from './models/BlobTokenRequestModel.model';
import { BlobFileUploadModel } from './models/BlobFileUploadModel.model';
import {saveAs}  from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { FileBaseModel } from './models/FileBaseModel.model';
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
  constructor(private apiService : ApiService, private http : HttpClient) {
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
    let FileObj = new FileBaseModel();
    FileObj.FileName = files.name;
    FileObj.FileFormat = files.name.toString().split('.')[1];
    FileObj.FileSize = files.size;
    FileObj.UploadedFileName = UploadFileName;
    FileObj.FileType = files.type;
    console.log(FileObj);
    let PostObj = new BlobTokenRequestModel();
    PostObj.TokenType = TokenTypes.UploadOrCreate;
    PostObj.FileName = null;
    this.apiService.post('api/ats/Generate', PostObj).subscribe(
      (response : any) => {
          this.uploadFile(files, UploadFileName, response.Token, response.FilePath, () => {
            FileObj.FilePath = response.FilePath;
            this.UploadFileRecord(FileObj);
          });
      },
      (error : any) => {
        console.error(error);
      }
    )
  }
  public UploadFileRecord(data : any) {
    this.apiService.post('api/afs/Upload', data).subscribe(
      (response : any) => {
        console.log(response);
      },
      (error : any) => {
        console.log(error);
      }
    )
  }
  public DeleteImage (name : string, FilePath : string, handler: () => void){
    this.ContainerClass(this.TokenStr, FilePath).deleteBlob(name).then(() => {
      handler();
    })
  }

  public uploadFile(File : Blob, name : string, Token: string, FilePath : string,  handler:() => void) {
    const blob_address = this.ContainerClass(Token, FilePath).getBlockBlobClient(`${FilePath}/${name}`);
    blob_address.uploadData(File, {blobHTTPHeaders:{blobContentType:File.type}}).then((response) => {
      console.log(response);
      handler();
    })
  }

  public async getAllFilesList(TokenStr : string, FilePath : string) {
    console.log(FilePath);
    const FilesList = this.ContainerClass(TokenStr, FilePath).listBlobsFlat({ prefix: FilePath });
    for await (const file of FilesList) {
      this.docLinks.push(`https://${this.accountName}.blob.core.windows.net/${this.containerName}/${file.name}${TokenStr}`);
    }

    console.log(this.docLinks);
  }

  private ContainerClass(TokenString : string, FilePath : string) : ContainerClient {
    console.log(`https://${this.accountName}.blob.core.windows.net?${TokenString}`);
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${TokenString}`).getContainerClient(this.containerName);
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
    this.apiService.post('api/ats/Generate', PostObj).subscribe(
      (response : any) => {
        this.getAllFilesList(response.Token, response.FilePath);
      },
      (error : any) => {
        console.error(error);
      }
    )
  }
  private SaveRecord() {
    
  }
  DownloadImage() {
    const fileId = '2b447128-ba8b-4f0c-b1e6-75bab775b32c  ';
    // api/blob
    this.apiService.get("api/blob/download?id=" + fileId).subscribe(
      (response : any) => {
        this.http.get(response.DownloadPath, { responseType: 'blob' }).subscribe({
          next: (blob) => {
            const fileNewName = response.FileName;
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileNewName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error('Error:', err);
          },
        });
      },
      (error : any) => {
        console.log(error);
      }
    )
  }
  // DownloadImage() {
  //   const ImageLink = '';

  //   this.http.get(ImageLink, { responseType: 'blob' }).subscribe({
  //     next: (blob) => {
  //       const fileNewName = 'RenamedFileName.png';
  //       saveAs(blob, fileNewName);
  //     },
  //     error: (err) => {
  //       console.error('Fail reason:', err);
  //     },
  //   });
  // }
}
