import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QrCodeComponent } from './qr-code.component';
import { QrCodeRoutingModule } from './qr-code.routing.module';

@NgModule({
  declarations: [
    QrCodeComponent
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule
  ],
  exports: [

  ]
})
export class QrCodeModule { }
