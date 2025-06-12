import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    draw$: Subject<void> = new Subject<void>();

    constructor(private http: HttpClient) { }

    getWord(): Observable<string> {
        return this.http.get<string[]>('https://random-word-api.vercel.app/api?words=1').pipe(map(res => res[0]));
    }
}
