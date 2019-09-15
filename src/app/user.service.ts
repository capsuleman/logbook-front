import { Injectable } from '@angular/core';
import { User } from './user';
import { of, Observable } from 'rxjs';
import { tap, share } from 'rxjs/internal/operators';
import { config } from './config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;
  private observable: Observable<User>;

  constructor(
    private http: HttpClient
  ) { }

  getUser(): Observable<any> {
    if (this.user) {
      return of(this.user);
    } else if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.http.get(config.apiUrl + '/auth/me')
        .pipe(
          tap((u: User) => {
            this.user = u;
          }),
          share()
        );
      return this.observable;
    }
  }

  deleteCache(): any {
    this.user = undefined;
    this.observable = undefined;
  }

  setPublicKey(publicKey: string) {
    this.user.key = publicKey;
    return this.http.post(config.apiUrl + '/auth/key', { key: publicKey });
  }

  deletePublicKey() {
    this.user.key = undefined;
    return this.http.delete(config.apiUrl + '/auth/key');
  }

}
