import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subscription } from 'rxjs';
import { HangmanComponent } from './components/hangman/hangman.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'hangman';

    @HostListener('document:keyup', ['$event'])
    handleKeyupEvent(event: KeyboardEvent) {
        this.onEnter(event.key);
    }

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

    onEnter(key: string): void {
        if (!this.reveal && /^[a-zA-z]$/.test(key)) {
            this.guess(key.toLowerCase());
        }
    }

    guess(letter: string): void {
        if (!this.guessed.includes(letter)) {
            this.guessed.push(letter);
            const correctIndices = [...this.word.matchAll(new RegExp(letter, 'g'))].map(a => a.index);
            if (correctIndices.length) {
                for (const index of correctIndices) this.displayed[index as number] = letter;
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
