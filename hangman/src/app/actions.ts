import { createAction, props } from "@ngrx/store";

export const loadWord = createAction('[Hangman] Load Word');
export const wordLoaded = createAction(
    '[Hangman] Word Loaded',
    props<{ word: string; }>()
);
