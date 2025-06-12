import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subscription } from 'rxjs';
import { HangmanComponent } from './components/hangman/hangman.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'hangman';

    @HostListener('document:keyup', ['$event'])
    handleKeyupEvent(event: KeyboardEvent) {
        if (!this.reveal && /^[a-zA-z]$/.test(event.key)) {
            this.guess(event.key.toLowerCase());
        }
    }

    @HostListener('document:click', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onClick(event: MouseEvent) {
        this.input.nativeElement.focus();
    }

    @ViewChild('invisibleInput') input: ElementRef = {} as ElementRef;
    @ViewChild(HangmanComponent) hangman: HangmanComponent = {} as HangmanComponent;

    word$: Observable<string> = this.api.getWord();
    word: string = '';
    displayed: string[] = [];

    guessed: string[] = [];
    wrongGuesses: string[] = [];

    reveal: boolean = false;

    subscription: Subscription = new Subscription();

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        for (const sub of [
            this.api.getWord().subscribe(word => {
                this.word = word;
                this.displayed = Array.from(word, _ => ' ')
            })
        ]) this.subscription.add(sub);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    guess(letter: string): void {
        if (!this.guessed.includes(letter)) {
            this.guessed.push(letter);
            const correctIndices = [...this.word.matchAll(new RegExp(letter, 'g'))].map(a => a.index);
            if (correctIndices.length) {
                for (const index of correctIndices) this.displayed[index as number] = letter.toUpperCase();
            } else {
                this.wrongGuesses.push(letter);
                this.api.draw$.next();
            }
        }
    }

    onDead(): void {
        this.reveal = true;
    }
}
