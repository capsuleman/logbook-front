import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'logbook-front';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.login();
  }

  login() {
    const u = 'Milo';
    const p = 'password';
    this.authService.login(u, p)
        .subscribe(res => {});
  }
}
