import { Injectable } from '@angular/core';
import { tap } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';
import { config } from './config';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  login(username: string, password: string) {
    return this.http.post(config.apiUrl + '/auth/login', { username, password })
      .pipe(tap(res => {
        this.setSession(res);
        return res;
      }));
  }

  register(username: string, password: string) {
    return this.http.post(config.apiUrl + '/auth/register', { username, password })
      .pipe(tap(res => {
        this.setSession(res);
        return res;
      }));
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
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
