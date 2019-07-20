import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getDate(): Observable<any> {
    return this.http.get(this.apiUrl + '/message/date');
  }

  getMessages(date: string): Observable<any> {
    return this.http.get(this.apiUrl + '/message/' + date);
  }

  postMessage(message): Observable<any> {
    return this.http.post(this.apiUrl + '/message', message);
  }

deleteMessage(id: number) {
  return this.http.delete(this.apiUrl + '/message/' + id.toString());
}
}
