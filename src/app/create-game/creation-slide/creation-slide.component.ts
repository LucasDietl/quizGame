import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonFacadeService } from 'src/app/store/common/common-facade.service';
import { SlideType } from 'src/app/store/create-game/create-game.state';
import { Observable, of } from 'rxjs';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';

@Component({
  selector: 'qz-creation-slide',
  templateUrl: './creation-slide.component.html',
  styleUrls: ['./creation-slide.component.scss']
})
export class CreationSlideComponent implements OnInit {
  @Input() slideForm!: any;
  @Input() index!: number;
  @Output() deleteSlide = new EventEmitter();
  public areYouSure: boolean = false;
  public imageUrlPreview: string = '';
  public type: SlideType = SlideType.quiz;
  public screenSize$: Observable<string> = of();
  public screenSizeNames = screenSizeNames;
  constructor(private commonFacadeService: CommonFacadeService){}

  ngOnInit(): void {
    this.screenSize$ = this.commonFacadeService.selectScreenSize();
    this.imageUrlPreview = this.slideForm?.value?.imageUrl;
    this.type = this.slideForm?.value?.type;
  }

  public handleDelete(): void {
    this.areYouSure = true;
  }

  public cancel(): void {
    this.areYouSure = false;
  }

  public makeSure(): void {
    this.cancel();
    this.deleteSlide.emit();
  }
}
