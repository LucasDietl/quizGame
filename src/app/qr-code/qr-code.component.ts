import * as QRCode from 'qrcode';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'qz-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
  private qrCodeUrl: string = environment.url;
  public qrCodeImage: string = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe(async params => {
      const gameId = params['id'];
      this.generateQRCode(`${this.qrCodeUrl}/joinGame/${gameId}`);
    });
  }

  private generateQRCode(url: string): void {
    QRCode.toDataURL(url,{scale: 50})
      .then((dataUrl: string) => {
        this.qrCodeImage = dataUrl;
      })
      .catch((err: any) => {
        console.error('Error generating QR code:', err);
      });
  }
}
