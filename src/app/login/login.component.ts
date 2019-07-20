import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() { }

  login() {
    const u = this.form.value.username;
    const p = this.form.value.password;
    this.authService.login(u, p)
      .subscribe(
        (res: any) => {
          console.log(res.auth);
          this.router.navigateByUrl('/main');
        },
        err => console.log(err.error.auth)
      );
  }


}
