import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private apiUrl = 'https://dictionaryapp-44vf.onrender.com'
  //  'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWordDetails(word: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/wordInfo/${word}`);
  }

  getRecommendations(word: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations/${word}`);
  }

  getRandomWord(): Observable<any> {
    return this.http.get(`${this.apiUrl}/random`);
  }
}
