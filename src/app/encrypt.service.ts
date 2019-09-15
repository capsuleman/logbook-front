import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  key: any;

  constructor() {
    // @ts-ignore;
    this.key = new CryptRSA();
  }

  setPublicKey(publicKey: string) {
    this.key.importKey(publicKey, 'public');
  }

  setPrivateKey(privateKey: string) {
    this.key.importKey(privateKey, 'private');
  }

  encrypt(fileContent: string) {
    return this.key.encrypt(fileContent, 'base64');
  }

  decrypt(encodedContent: string) {
    return this.key.decrypt(encodedContent, 'utf-8');
  }

  generatePair() {
    this.key.generateKeyPair();
    const pubkey = this.key.exportKey('public');
    const prikey = this.key.exportKey();
    return {pubkey, prikey};
  }

}
