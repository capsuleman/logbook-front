import { Component, OnInit, OnChanges, Input, HostListener } from '@angular/core';
import { MessageService } from '../message.service';
import { EncryptService } from '../encrypt.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnChanges {

  constructor(
    private messageService: MessageService,
    private encryptService: EncryptService
  ) { }

  messages = [];
  newText = '';
  newType = 'ADD';
  newTarget = 0;
  privateKeyExists = false;
  @Input() target: string;

  private dateToString(d: Date) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.stopEdit();
    }
  }

  ngOnInit() {
    const defaultDate = new Date();
    this.target = this.dateToString(defaultDate);

    this.loadMessages();
  }

  ngOnChanges(changes) {
    if (changes.target && changes.target.previousValue) {
      this.loadMessages();
    }
  }


  loadMessages() {
    this.messageService.getMessages(this.target).subscribe(messages => {
      messages.sort((a, b) => a.rowid - b.rowid);
      this.messages = [];
      messages.map(message => {
        message.show = false;
        if (this.privateKeyExists) {
          message.decrypted = JSON.parse(this.decrypt(message.message));
          if (message.decrypted.type === 'ADD') {
            this.messages.push(message);
          } else if (message.decrypted.type === 'EDIT') {
            this.messages = this.messages.map(mess => {
              if (mess.rowid === message.decrypted.target) {
                mess = message;
              }
              return mess;
            });
          } else if (message.decrypted.type === 'DELETE') {
            this.messages = this.messages.filter(el => el.rowid !== message.decrypted.target);
          }
        } else {
          this.messages.push(message);
        }
      });
    });
  }


  postMessage(type, target, text, cb) {
    const newData: { [k: string]: any } = {};
    const payload = { type, target, text };

    newData.message = this.encrypt(JSON.stringify(payload));
    newData.target = this.target;

    this.messageService.postMessage(newData).subscribe(id => {
      newData.decrypted = payload;
      newData.post = new Date().toISOString().substring(0, 19);
      newData.rowid = id;

      cb(newData);

      this.newType = 'ADD';
      this.newTarget = 0;
      this.newText = '';
    });
  }

  addMessage() {
    this.postMessage(this.newType, 0, this.newText, newData => {
      this.messages.push(newData);
    });
  }


  deleteMessage(id: number) {
    this.postMessage('DELETE', id, '', newData => {
      this.messages = this.messages.filter(el => el.rowid !== id);
    });
  }

  editMessage() {
    const id = this.newTarget;
    this.postMessage(this.newType, id, this.newText, newData => {
      this.messages = this.messages.map(mess => {
        if (mess.rowid === id) {
          mess = newData;
        }
        return mess;
      });
    });
  }

  setPublicKey($event: string) {
    this.encryptService.setPublicKey($event);
  }

  setPrivateKey($event: string) {
    this.encryptService.setPrivateKey($event);
    this.privateKeyExists = true;
    this.loadMessages();
  }

  encrypt(text: string) {
    return this.encryptService.encrypt(text);
  }

  decrypt(text: string) {
    return this.encryptService.decrypt(text);
  }

  startEdit(message) {
    this.newType = 'EDIT';
    this.newTarget = message.rowid;

    if (message.decrypted) {
      this.newText = message.decrypted.text;
    }
  }

  splitMessage(message, len, short) {
    let splited = '';
    const limit = short ? len : message.length;
    for (let i = 0; i < limit; i = i + len) {
      splited += message.substring(i, i + len) + '\n';
    }
    return splited;
  }

  stopEdit() {
    this.newType = 'ADD';
    this.newTarget = 0;
    this.newText = '';

  }
}
