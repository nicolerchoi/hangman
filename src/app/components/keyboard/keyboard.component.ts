import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
    @Input() correct: string[] = [];
    @Input() wrong: string[] = [];

    @Output() enter: EventEmitter<string> = new EventEmitter();

    layout = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
}
