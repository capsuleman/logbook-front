import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../message.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private messageService: MessageService
  ) { }

  dates = [];
  target: NgbDate;
  @Output() dateEvent = new EventEmitter<string>();

  private dateToNgbDate(date: Date): NgbDate {
    return new NgbDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  private ngbDateToString(date: NgbDate): string {
    const m = date.month < 10 ? '0' + date.month : date.month;
    const d = date.day < 10 ? '0' + date.day : date.day;
    return date.year + '-' + m + '-' + d;
  }

  ngOnInit() {
    const today = new Date();
    this.target = this.dateToNgbDate(today);
    this.sendDate();

    this.messageService.getDate().subscribe(d => this.dates = d);
  }

  sendDate() {
    this.dateEvent.emit(this.ngbDateToString(this.target));
  }

  isInDates(date: NgbDate) {
    return this.dates.indexOf(this.ngbDateToString(date)) !== -1;
  }
}
