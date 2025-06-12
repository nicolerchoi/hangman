import { createReducer, on } from "@ngrx/store";
import { wordLoaded } from "./actions";

export const initialState = '';

export const reducer = createReducer(
    initialState,
    on(wordLoaded, (_, { word }) => word)
)