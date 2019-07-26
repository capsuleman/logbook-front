import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';
import { config } from './config';

import * as moment from 'moment';

import { User } from './user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = config.apiUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  login(username: string, password: string) {
    return this.http.post(this.apiUrl + '/auth/login', { username, password })
      .pipe(tap(res => {
        this.setSession(res);
        return res;
      }));
  }

  register(username: string, password: string) {
    console.log(this.apiUrl + '/auth/register');
    return this.http.post(this.apiUrl + '/auth/register', { username, password })
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

  me(): Observable<User> {
    return this.userService.getUser();
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

  setPublicKey(publicKey: string) {
    return this.http.post(this.apiUrl + '/auth/key', { key: publicKey });
  }

  deletePublicKey() {
    return this.http.delete(this.apiUrl + '/auth/key');
  }
}
