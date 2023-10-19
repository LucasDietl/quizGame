import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'qz-creation-slide-option',
  templateUrl: './creation-slide-option.component.html',
  styleUrls: ['./creation-slide-option.component.scss']
})
export class CreationSlideOptionComponent {
  @Input() option: any;
}
