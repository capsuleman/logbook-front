import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'logbook-front';

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    if (this.authService.isLoggedOut()) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/main');
    }
  }

}
