import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { HangmanComponent } from './components/hangman/hangman.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'hangman';

    @HostListener('document:keyup', ['$event'])
    handleKeyupEvent(event: KeyboardEvent) {
        this.onEnter(event.key);
    }

    @ViewChild(HangmanComponent) hangman: HangmanComponent = {} as HangmanComponent;

    word: string = '';
    displayed: string[] = [];

    guessed: string[] = [];
    wrongGuesses: string[] = [];

    reveal: boolean = false;

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.getNewWord();
    }

    async getNewWord(): Promise<void> {
        this.word = await this.api.getWord().toPromise() ?? '';
        this.displayed = Array.from(this.word, _ => ' ');
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

    get isComplete(): boolean {
        return !this.displayed.includes(' ');
    }

    onDead(): void {
        this.reveal = true;
    }

    restart(): void {
        this.getNewWord();
        this.guessed = [];
        this.wrongGuesses = [];
        this.reveal = false;
        this.hangman.reset();
    }
}
