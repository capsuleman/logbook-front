import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private username: string;
  private password: string;
  private publickey: string;

  constructor(
    private authService: AuthService,
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


}
