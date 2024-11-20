
export enum TokenTypes {
    UploadOrCreate = 1,
    Download = 2,
    List = 3,
    Delete = 4,
    WriteOrUpdate = 5
  }

  export class BlobTokenRequestModel{
    public TokenType : any  = TokenTypes;
    public FileName : any;
}