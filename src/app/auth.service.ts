import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as moment from 'moment';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(this.apiUrl + '/auth/login', { username, password })
      .pipe(tap(res => {
        this.setSession(res);
        console.log('test');
        this.me().subscribe(rep => {
          console.log(rep);
        });
      }));
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  me(): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/auth/me');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
