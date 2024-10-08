import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryService } from '../services/dictionary.service';
@Component({
  selector: 'word-page',
  template: `
    <div class="word-page-container">
      <loader *ngIf="!wordDetails"></loader>
      <div class="word-page-card" *ngIf="wordDetails">
        <word-header
          [wordDetails]="wordDetails"
          [isWordOfTheDay]="isWordOfTheDay"
          (practiceWord)="practiceWord($event)"
        ></word-header>

        <div class="definitions-container">
          <div class="definitions-title">Definition<ng-container *ngIf="!isWordOfTheDay && wordDetails.partsOfSpeech.length > 1">s</ng-container>
          </div>
          <div
            class="definitions"
            *ngFor="let partOfSpeech of wordDetails.partsOfSpeech"
          >
            <span
              *ngIf="partOfSpeech.partOfSpeech"
              class="chip"
              [ngStyle]="getPartOfSpeechColor(partOfSpeech.partOfSpeech)"
            >
              {{ partOfSpeech.partOfSpeech }}
            </span>
            <p class="definition-item">
               {{ partOfSpeech.definition}}
            </p>
          </div>
        </div>

        <div *ngIf="isWordOfTheDay" class="view-word-btn">
          <push-button
            [buttonText]="'View Word'"
            (buttonClick)="viewWord()"
          ></push-button>
        </div>

        <div
          class="examples-section"
          *ngIf="!isWordOfTheDay && wordDetails.examples?.length > 0"
        >
          <h2 class="examples-title">Examples</h2>
          <ul class="examples-list">
            <li *ngFor="let example of wordDetails.examples">{{ example }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .word-page-container {
      display: flex;
      justify-content: center;
      margin-top: 25px;
    }

    .word-title {
      font-size: 2rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .word-page-card {
      width: 600px;
      background-color: #fff;
      text-align: left;
      padding: 0px 20px;
    }

    .definitions-title, .examples-title {
      font-weight: 600;
      margin: 12px 0px;
    }

    .definitions-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .definitions {
      padding: 12px 16px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
    }

    .chip {
      font-size: 12px;
      font-weight: bold;
      color: #495057;
      padding: 6px 8px;
      border-radius: 6px;
    }

    .definition-item {
      margin-top: 6px;
      font-size: 1rem;
      line-height: 1.6;
      color: #343a40;
      display: flex;
      flex-wrap: wrap;
    }

    .view-word-btn {
      margin: 16px auto;
      display: flex;
      justify-content: center;
    }

    .examples-section {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 4px solid #f7f7f7;
    }

    .examples-list {
      list-style-type: disc;
      margin-left: 20px;
    }

    .examples-list li {
      margin-bottom: 10px;
    }

    .popover {
      position: absolute;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 20px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      border-radius: 11px;
      min-width: 270px;
    }

    .no-meaning {
      color: red;
      font-size: 14px;
    }

    .word {
      margin-right: 4px;
      cursor: pointer;
    }

    @media (max-width: 600px) {
        .word-page-card  {
           width: 100%;
        }
    }
  `,
  ],
})
export class WordPage implements OnInit {
  @Input() wordDetails: any;
  @Input() isWordOfTheDay: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private dictionaryService: DictionaryService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const word = params['word'];
      if (word) {
        this.dictionaryService.getWordDetails(word).subscribe((data) => {
          this.wordDetails = data;
        });
      }
    });
  }

  practiceWord(word: string) {
    this.router.navigate(['/practice', word]);
  }

  getPartOfSpeechColor(partOfSpeech: string) {
    const colorMap: any = {
      noun: { background: '#E8F5E9', color: '#1B5E20' },
      verb: { background: '#E8EAF6', color: '#1A237E' },
      adjective: { background: '#FFEBEE', color: '#B71C1C' },
      adverb: { background: '#F3E5F5', color: '#ba68c8' },
      other: { background: '#FFF3E0', color: '#E65100' },
    };
    return colorMap[partOfSpeech.toLowerCase()] || colorMap['other'];
  }

  viewWord() {
    this.router.navigate(['/word', this.wordDetails.word]);
  }

}
