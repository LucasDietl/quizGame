import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'qz-game-option',
    templateUrl: './game-option.component.html',
    styleUrls: ['./game-option.component.scss']
})
export class GameOptionComponent {
    @Input() text!: string;
    @Input() isDisabled: boolean = true;
    @Input() color: 'red' | 'blue' | 'green' | 'yellow' = 'green';


    @Output() selected = new EventEmitter<void>();
    
    
    constructor() {

    }

    optionSelected() : void {
        if(!this.isDisabled) {
            this.selected.emit();
        } 
    }
    
}
