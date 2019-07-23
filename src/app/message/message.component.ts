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

  addMessage() {
    const newData: { [k: string]: any } = {};
    newData.message = this.encrypt(this.newText);
    newData.target = this.target;

    this.messageService.postMessage(newData).subscribe(id => {
      newData.decrypted = this.newText;
      this.newText = '';
      newData.post = new Date().toISOString().substring(0, 19);
      newData.rowid = id;
      newData.show = this.decrypting;
      this.messages.push(newData);
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages = this.messages.filter(el => el.rowid !== id);
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
    this.messages.map(message => message.decrypted = this.decrypt(message.message));
  }

  test(a) {
    console.log(a);
  }
}
