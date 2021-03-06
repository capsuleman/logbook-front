import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { EncryptService } from '../encrypt.service';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string;
  password: string;
  publickey: string;
  privatekey: string;
  valid = false;
  isFreeText = '';

  constructor(
    private authService: AuthService,
    private encryptService: EncryptService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() { }

  register() {
    this.authService.register(this.username, this.password)
      .subscribe(() => {
        return this.userService.setPublicKey(this.publickey)
          .subscribe(() => {
            this.router.navigateByUrl('/main');
          });
      },
        err => console.error(err.error.auth)
      );
  }

  generate() {
    const pair = this.encryptService.generatePair();
    this.publickey = pair.pubkey;
    this.privatekey = pair.prikey;
    this.valid = true;
  }

  test() {
    const stringToTest = this.username + this.password;
    try {
      this.encryptService.setPrivateKey(this.privatekey);
      this.encryptService.setPublicKey(this.publickey);
      this.valid = stringToTest === this.encryptService.decrypt(this.encryptService.encrypt(stringToTest));
    } catch (err) {
      this.valid = false;
    }
  }

  isFree() {
    this.isFreeText = '...';
    const oldValid = this.valid;
    this.valid = false;
    this.authService.isFree(this.username).subscribe(num => {
      if (num === 0) {
        this.isFreeText = 'Free';
        this.valid = oldValid;
      } else {
        this.isFreeText = 'Used';
      }
    });
  }
}
