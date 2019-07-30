import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})
export class EncryptComponent implements OnInit {

  privateKey = '';
  publicKey = '';
  isPrivateKeySet = false;

  @Output() privateKeyEvent = new EventEmitter<string>();
  @Output() publicKeyEvent = new EventEmitter<string>();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser().subscribe((user: any) => {
      this.publicKey = user.key;
      if (this.publicKey !== null && this.publicKey.length !== 0) {
        this.setPublicKey();
      }
    });
  }

  savePublicKey() {
    this.userService.setPublicKey(this.publicKey).subscribe(_ => {
      const publicKeyText = document.getElementById('publicKeyText');
      publicKeyText.setAttribute('disabled', '');
      const publicKeyButton = document.getElementById('publicKeyButton');
      publicKeyButton.textContent = 'Modify public key';
    });
    this.setPublicKey();
  }

  setPublicKey() {
    this.publicKeyEvent.emit(this.publicKey);
  }

  setPrivateKey() {
    this.privateKeyEvent.emit(this.privateKey);
    this.isPrivateKeySet = true;
  }
}
