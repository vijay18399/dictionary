import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpellBeeService {
  private wordSubject = new BehaviorSubject<string>('');
  private userInputSubject = new BehaviorSubject<string[]>([]);

  word$ = this.wordSubject.asObservable();
  userInput$ = this.userInputSubject.asObservable();

  constructor() {}

  setWord(word: string): void {
    this.wordSubject.next(word);
    this.setUserInput(Array(word.length).fill(''));
  }

  setUserInput(input: string[]): void {
    this.userInputSubject.next(input);
  }

  checkAnswer(): boolean {
    const currentWord = this.wordSubject.getValue();
    const userInput = this.userInputSubject.getValue().join('');
    return currentWord === userInput;
  }
}
