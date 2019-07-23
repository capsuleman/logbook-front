import { Component, OnInit, OnChanges, Input } from '@angular/core';
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

  private messages = [];
  private newText = '';
  private newType = 'ADD';
  private newTarget = 0;
  private decrypting = false;
  private privateKeyExists = false;
  @Input() target: string;

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

    this.getMessages();
  }

  ngOnChanges(changes) {
    if (changes.target) {
      this.getMessages();
    }
  }

  getMessages() {
    this.messageService.getMessages(this.target).subscribe(mess => {
      this.messages = mess;
      this.messages.map(message => message.show = this.decrypting);
      if (this.privateKeyExists) {
        this.decryptMessages();
      }
    });
  }

  postMessage(type, target, text, cb) {
    const newData: { [k: string]: any } = {};
    const payload = {type, target, text};

    newData.message = this.encrypt(JSON.stringify(payload));
    newData.target = this.target;

    this.messageService.postMessage(newData).subscribe(id => {
      newData.decrypted = payload;
      newData.post = new Date().toISOString().substring(0, 19);
      newData.rowid = id;
      newData.show = this.decrypting;

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
          console.log(mess);
          mess = newData;
          console.log(mess);
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
    this.decryptMessages();
  }

  setDecryptingEvent($event: boolean) {
    this.decrypting = $event;
    this.messages.map(message => message.show = $event);
  }

  encrypt(text: string) {
    return this.encryptService.encrypt(text);
  }

  decrypt(text: string) {
    return this.encryptService.decrypt(text);
  }
  decryptMessages() {
    this.messages.map(message => message.decrypted = JSON.parse(this.decrypt(message.message)));
  }

  startEdit(message) {
    this.newType = 'EDIT';
    this.newTarget = message.rowid;
    console.log(this.newTarget);

    if (message.decrypted) {
      this.newText = message.decrypted.text;
    }
  }
}
