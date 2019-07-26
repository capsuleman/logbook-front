import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  target = '';

  constructor() { }

  ngOnInit() {
  }

  receiveDate($event) {
    this.target = $event;
  }

}
