import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5156';

  constructor(private http: HttpClient) { }

  get(Url: string) : Observable<any>{
    return this.http.get(`${this.apiUrl}/${Url}`,{'headers':this.headers()})
}

post(Url: string,data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${Url}`,data, {'headers':this.headers()});
}
  public headers(){
    const requestid = '26870b92-10c1-4bcd-83fa-cdd49f69dac';
    const ModuleCode = '2D1B5352-C4E5-4C1B-8F79-EE63C085B2AD';
    const ConnectionId = '6A7FC7FB-81A5-4D05-8B60-A7A972BBF972'; 
    const httpHeaders = new HttpHeaders({
        'apptype':'Web', 
        'Cache-Control':'no-cache', 
        'Content-Type':'application/json; charset=utf-8', 
        'content-type':'application/json',
        'requestid':requestid, 
        'ConnectionId':ConnectionId != null ? ConnectionId: '',
        'ModuleCode':ModuleCode
    });

    return httpHeaders;
};
}
