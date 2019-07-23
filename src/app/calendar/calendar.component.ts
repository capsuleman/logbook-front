import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  dates = [];
  target = '';

  @Output() dateEvent = new EventEmitter<string>();

  private dateToString(d: Date) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  ngOnInit() {
    const defaultDate = new Date();
    this.target = this.dateToString(defaultDate);
    this.dates.push(this.target);

    this.messageService.getDate().subscribe(d => {
      d.map(el => {
        if (this.dates.indexOf(el) === -1) {
          this.dates.push(el);
        }
      });
      this.dates.sort((a, b) => {
        const aDate = new Date(a);
        const bDate = new Date(b);
        return bDate.getTime() - aDate.getTime();
      });
    });
    this.sendDate();
  }

  sendDate() {
    this.dateEvent.emit(this.target);
  }

}
