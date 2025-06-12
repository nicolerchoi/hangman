import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HangmanComponent } from './components/hangman/hangman.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

@NgModule({
    declarations: [
        AppComponent,
        HangmanComponent,
        KeyboardComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
