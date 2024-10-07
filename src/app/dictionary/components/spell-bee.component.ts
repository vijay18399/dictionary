import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { SpellBeeService } from '../services/spell-bee.service';
import { DictionaryService } from '../services/dictionary.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'spell-bee',
  template: `
    <div class="spell-bee-game">
      <h2 class="title">
        Spell Bee
      </h2>
      <button class="play-audio-btn" (click)="playAudio()">
        <i class="fa-solid fa-volume-high"></i> Listen to the word
      </button>

      <div class="input-fields">
        <input *ngFor="let input of inputs; let i = index"
              [(ngModel)]="userInput[i]" maxlength="1"
              (ngModelChange)="setActiveInput($event, i)"
              (keydown)="handleKeyNavigation($event, i)"
              (focus)="updateActiveIndex(i)"
              [class.active]="activeIndex === i" #inputField />
      </div>

      <push-button
        [buttonText]="'Submit'"
        (buttonClick)="submitAnswer()"
      ></push-button>

      <!-- Success/Failure Messages -->
      <div *ngIf="showMessage" class="result-message" [ngClass]="{ 'success': isCorrect, 'failure': !isCorrect }">
        <p *ngIf="isCorrect">Congratulations! You spelled the word correctly.</p>
        <p *ngIf="!isCorrect">Better luck next time! The correct spelling was {{ word }}.</p>
      </div>
    </div>
  `,
  styles: [
    `.spell-bee-game {
      text-align: center;
    }
    .title {
      font-size: 1.8rem;
      color: #0D47A1;
      margin-bottom: 16px;
      font-weight: bold;
    }
    .play-audio-btn {
      background-color: #E8EAF6;
      color: #1A237E;
      border: none;
      cursor: pointer;
      padding: 10px;
      border-radius: 10px;
      margin: 10px 0px;
    }
    .input-fields {
      margin: 20px 0;
    }
    input {
        width: 36px;
        height: 50px;
        text-align: center;
        margin: 0 5px;
        font-size: 24px;
        outline: 1px solid #d6d0d0;
        border-radius: 6px;
    }
    input.active {
        border: 2px solid #3f51b5;
    }
    .result-message {
      margin-top: 20px;
      font-size: 1.2rem;
    }
    .success {
      color: green;
    }
    .failure {
      color: red;
    }`
  ]
})
export class SpellBeeComponent implements OnInit {
  word: string = '';
  audioUrl: string = '';
  inputs: string[] = [];
  userInput: string[] = [];
  activeIndex: number = 0;
  isCorrect: boolean = false;  // Track if the answer is correct
  showMessage: boolean = false;  // Show result message

  @ViewChildren('inputField') inputFieldElements!: QueryList<ElementRef>;

  constructor(
    private dictionaryService: DictionaryService,
    private spellBeeService: SpellBeeService
  ) {}

  ngOnInit(): void {
    this.getNewWord();
    this.spellBeeService.word$.subscribe((word) => this.word = word);
    this.spellBeeService.userInput$.subscribe((input) => this.userInput = input);
  }

  getNewWord(): void {
    this.dictionaryService.getRandomWord().subscribe((data) => {
      this.word = data.word.toLowerCase();
      this.audioUrl = data.CEFR?.Voice;
      this.inputs = Array(this.word.length).fill('');
      this.spellBeeService.setWord(this.word);
      this.activeIndex = 0;
      this.showMessage = false;  // Reset message visibility
      setTimeout(() => this.focusInput(this.activeIndex), 0);
    });
  }

  playAudio(): void {
    if (this.audioUrl) {
      let audio = new Audio(this.audioUrl);
      audio.play();
    } else {
      this.textToSpeech(this.word);
    }
  }

  textToSpeech(word: string): void {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis && word) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }

  setActiveInput(value: string, index: number): void {
    const updatedUserInput = [...this.userInput];
    updatedUserInput[index] = value;
    this.spellBeeService.setUserInput(updatedUserInput);

    if (value !== '' && index < this.userInput.length - 1) {
      this.activeIndex = index + 1;
    } else if (value === '' && index > 0) {
      this.activeIndex = index - 1;
    }

    this.focusInput(this.activeIndex);
  }

  handleKeyNavigation(event: KeyboardEvent, index: number): void {
    if (event.key === 'ArrowRight' && index < this.userInput.length - 1) {
      this.activeIndex = index + 1;
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.activeIndex = index - 1;
    } else if (event.key === 'Backspace' && index > 0 && !this.userInput[index]) {
      this.activeIndex = index - 1;
    }

    this.focusInput(this.activeIndex);
  }

  submitAnswer(): void {
    if (this.spellBeeService.checkAnswer()) {
      this.isCorrect = true;
      this.triggerConfetti();
    } else {
      this.isCorrect = false;
    }
    this.showMessage = true;
    setTimeout(() => this.getNewWord(), 3000);  // Fetch a new word after 3 seconds
  }

  triggerConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  focusInput(index: number): void {
    const inputField = this.inputFieldElements.toArray()[index];
    if (inputField) {
      inputField.nativeElement.focus();
    }
  }

  updateActiveIndex(index: number): void {
    this.activeIndex = index;
  }
}
