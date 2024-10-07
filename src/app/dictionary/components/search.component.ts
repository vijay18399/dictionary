import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DictionaryService } from '../services/dictionary.service';
@Component({
  selector: 'word-search',
  template: `
    <div class="search-container">
      <input
        id="word-input"
        type="text"
        [formControl]="wordControl"
        placeholder="Type a word..."
        (keydown.enter)="onEnter()"
        class="word-input"
      />

      <ul *ngIf="recommendations.length > 0" class="recommendation-list">
        <li
          *ngFor="let word of recommendations"
          class="recommendation-item"
          (click)="onWordClick(word)"
        >
          <a class="word-link">
            <span [innerHTML]="highlightMatch(word, wordControl.value)"></span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 400px;
      width: 100%;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
    }

    .word-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #E8EAF6;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .word-input:focus {
      border-color: #9FA8DA;
      outline: none;
    }

    .recommendation-list {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      background-color: #ffffff;
      border: 1px solid #9E9E9E;
      border-radius: 4px;
      margin-top: 5px;
      padding-left: 0;
      list-style-type: none;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .recommendation-item {
      padding: 10px;
      cursor: pointer;
      background-color: #ffffff;
      transition: background-color 0.3s ease;
    }

    .recommendation-item:hover {
      background-color: #e8f5e9;
    }

    .word-link {
      text-decoration: none;
      color: #1a73e8;
      font-weight: 500;
    }

    .highlight {
      font-weight: bold;
      color: #ff5722;
    }
  `]
})
export class WordSearch {
  wordControl = new FormControl();
  recommendations: string[] = [];

  constructor(
    private dictionaryService: DictionaryService,
    private router: Router
  ) {
    this.wordControl.valueChanges.subscribe(value => {
      if (value) {
        this.dictionaryService.getRecommendations(value).subscribe(data => {
          this.recommendations = data.slice(0, 5); // Limit to 5 suggestions
        });
      } else {
        this.recommendations = [];
      }
    });
  }

  onEnter() {
    const word = this.wordControl.value;
    if (word) {
      this.router.navigate(['word', word]);
      this.clearRecommendations();
    }
  }

  onWordClick(word: string) {
    this.router.navigate(['word', word]);
    this.clearRecommendations();
  }

  // Highlight the matching part of the word
  highlightMatch(word: string, searchTerm: string): string {
    if (!searchTerm) return word;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return word.replace(regex, '<span class="highlight">$1</span>');
  }

  clearRecommendations() {
    this.recommendations = [];
    this.wordControl.reset();
  }
}
