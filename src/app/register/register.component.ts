import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { EncryptService } from '../encrypt.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private username: string;
  private password: string;
  private publickey: string;
  private privatekey: string;
  private valid = false;

  constructor(
    private authService: AuthService,
    private encryptService: EncryptService,
    private router: Router) { }

  ngOnInit() { }

  register() {
    this.authService.register(this.username, this.password)
      .subscribe(
        (res: any) => {
          return this.authService.setPublicKey(this.publickey).subscribe((res2: any) => {
            console.log(res2);
            this.router.navigateByUrl('/main');
          });
        },
        err => console.log(err.error.auth)
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
      console.log(this.encryptService.decrypt(this.encryptService.encrypt(stringToTest)));
    } catch (err) {
      this.valid = false;
    }
  }
}
