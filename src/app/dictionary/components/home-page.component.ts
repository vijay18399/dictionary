import { Component } from '@angular/core';
import { DictionaryService } from '../services/dictionary.service';

@Component({
  selector: 'home-page',
  template: `
    <div class="container">
     <div  class="word-card">
      <h2 class="title">
        Word of the Day
        <span class="date-container">{{ currentDate | date: 'dd/MM/yyyy' }}</span>
      </h2>
      <word-page [wordDetails]="randomWord" [isWordOfTheDay]="true"></word-page>
    </div>
    </div>
  `,
    styles: [`
      :host {
        max-width: 100%;
        padding-top: 10px;
        display: flex;
        justify-content: center;
      }
      .container{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .word-card {
        background-color: #fff;
        width: 600px;
        text-align: left;
      }

      .title {
        font-size: 1.8rem;
        color: #0D47A1;
        text-align: center;
        margin-bottom: 16px;
        font-weight: bold;
      }

      .date-container {
        font-size: 0.9rem;
        color: #6c757d;
        margin-left: 8px;
      }

      @media (max-width: 600px) {
        .word-card {
           width: 90%;
        }
        h2 {
          font-size: 1.6rem;
        }
      }
    `]
})
export class HomePage {

  randomWord: any;
  currentDate: Date = new Date();

  constructor(
    private dictionaryService: DictionaryService
  ) {}

  ngOnInit() {
    this.fetchRandomWord();
  }

  fetchRandomWord() {
    this.dictionaryService.getRandomWord().subscribe(data => {
      this.randomWord = data;
      this.randomWord.partsOfSpeech = this.randomWord.partsOfSpeech.splice(0, 1); // Limit parts of speech to 1
    });
  }
}
