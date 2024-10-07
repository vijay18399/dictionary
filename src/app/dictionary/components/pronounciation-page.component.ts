import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { DictionaryService } from '../services/dictionary.service';

enum ListeningState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  FEEDBACK = 'FEEDBACK'
}

@Component({
  selector: 'pronounciation-page',
  template: `
    <div class="word-page-container">
      <div class="word-page-card" *ngIf="wordDetails">
        <word-header
          [wordDetails]="wordDetails"
          [isWordOfTheDay]="true"
        ></word-header>
        <audio #startSound src="sounds/start-sound.mp3"></audio>
        <audio #stopSound src="sounds/stop-sound.mp3"></audio>
        <audio #successSound src="sounds/success-sound.mp3"></audio>
        <div class="instruction-area">
          <ng-container [ngSwitch]="listeningState">
            <ng-container *ngSwitchCase="listeningStates.IDLE">
              <p>Tap the <i class="fa fa-microphone"></i> button to start practice!</p>
            </ng-container>
            <ng-container *ngSwitchCase="listeningStates.RECORDING">
              <p  *ngIf="!spokenWord">Listening...</p>
              <p  *ngIf="spokenWord">
                <span [ngStyle]="{ 'color' : word.isCorrect ? 'green' : 'red'  }" *ngFor="let word of spokenWordFeedbackList" >
                  {{word.word}}
                </span>
              </p>
            </ng-container>
            <ng-container *ngSwitchCase="listeningStates.FEEDBACK">
              <p  *ngIf="spokenWord">
                <span [ngStyle]="{ 'color' : word.isCorrect ? 'green' : 'red'  }" *ngFor="let word of spokenWordFeedbackList" >
                  {{word.word}}
                </span>
              </p>
              <ng-container *ngIf="isSuccess; else failTemplate">
                <p>🎉 Awesome Job, Superstar! 🎉</p>
              </ng-container>
              <ng-template #failTemplate>
                <p>Oops! You're still learning, and that's totally okay! Give it another try! 😊</p>
              </ng-template>
            </ng-container>
          </ng-container>
        </div>

        <div class="practice-container">
          <button *ngIf="!isMatched && listeningState != listeningStates.FEEDBACK" class="practice-btn" [ngClass]="{ 'recording': listeningState === listeningStates.RECORDING }"
            (click)="toggleListening()">
            <span *ngIf="listeningState === listeningStates.IDLE"> <i class="fa fa-microphone"></i></span>
            <span *ngIf="listeningState === listeningStates.RECORDING"> <i class="fa-solid fa-circle-stop"></i></span>
          </button>

          <div *ngIf="listeningState === listeningStates.FEEDBACK" class="feedback">
            <div *ngIf="isSuccess" class="feedback-details">
              <span class="chip">WPM: {{ wpm }}</span>
              <span class="chip">Time Taken: {{ timeTaken }} seconds</span>
            </div>
            <button class="try-again-btn" (click)="tryAgain()">
            <i class="fa-solid fa-rotate-left"></i>  Try Again
            </button>
          </div>
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
        padding: 0px 16px;
      }

      .word-page-card {
        width: 100%;
        max-width: 600px;
        background-color: #fff;
        border-radius: 20px;
        text-align: left;
      }

      .instruction-area {
        min-height: 200px;
        background: rgba(0, 0, 0, 0.0117647059);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        flex-direction: column;
        gap: 10px;
      }

      .practice-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
      }

      .practice-btn {
        background-color: #0D47A1;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        border: none;
        margin-bottom: 20px;
      }

      .practice-btn.recording {
        background-color: #E53935;
      }

      .feedback {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        border-radius: 10px;
      }

      .feedback-details {
        margin-top: 10px;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        gap: 10px;
      }

      .feedback .chip {
        font-size: 14px;
        font-weight: bold;
        background: #F8BBD0;
        color: #880E4F;
        padding: 6px 12px;
        border-radius: 6px;
      }

      .try-again-btn {
        background: #1A237E;
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 10px;
        transition: background-color 0.3s;
      }



    `,
  ],
})
export class PronounciationPage implements OnInit, OnDestroy {
  wordDetails: any;
  isSuccess:boolean = false;
  isMatched: boolean = false;
  recognition: any;
  spokenWord: string = '';
  listeningState: ListeningState = ListeningState.IDLE;
  listeningStates = ListeningState;
  isSupported: boolean = true;
  @ViewChild('startSound') startSound: any;
  @ViewChild('stopSound') stopSound: any;
  @ViewChild('audioPlayer') audioPlayer: any;
  @ViewChild('successSound') successSound: any;

  startTime: number = 0;
  endTime: number = 0;
  wpm: number = 0;
  timeTaken: number = 0;

  constructor(
    private route: ActivatedRoute,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const word = params['word'];
      if (word) {
        this.dictionaryService.getWordDetails(word).subscribe(data => {
          this.wordDetails = data;
        });
      }
    });

    this.initializeSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.listeningState = ListeningState.RECORDING;
      this.startTime = Date.now();
      this.playStartSound();
      this.cdr.detectChanges();
    };

    this.recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.trim().toLowerCase();
      this.spokenWord += " " + transcript;
      this.checkPronunciation(transcript);
      this.cdr.detectChanges();
    };

    this.recognition.onend = () => {
      this.endTime = Date.now();
      this.timeTaken = Number(((this.endTime - this.startTime) / 1000).toFixed(1));
      this.wpm = this.calculateWPM(this.spokenWord, this.timeTaken);
      this.listeningState = ListeningState.FEEDBACK;
      this.cdr.detectChanges();
    };
  }

  toggleListening() {
    if (this.listeningState === ListeningState.IDLE) {
      this.listeningState = ListeningState.RECORDING;
      this.startListening();
      this.cdr.detectChanges();
    } else if (this.listeningState === ListeningState.RECORDING) {
      this.stopListening();
      this.cdr.detectChanges();
    }
  }

  startListening() {
    if (this.recognition) {
      this.spokenWord = '';
      this.isSuccess = false;
      this.recognition.start();
    }
  }

  stopListening() {
    this.playStopSound();
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  playAudio() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  get spokenWordFeedbackList() {
    const correctWord = this.wordDetails?.word?.toLowerCase();
    return this.spokenWord.split(' ').map(word => {
      return {
        word: word,
        isCorrect: word === correctWord,
      };
    });
  }

  checkPronunciation(spokenWord: string) {
    const correctWord = this.wordDetails?.word?.toLowerCase();
    if (spokenWord.includes(correctWord)) {
      this.isMatched = true;
      this.playSuccessSound();
      this.stopListening();
      this.listeningState = ListeningState.FEEDBACK;
      this.isSuccess = true;
      this.triggerConfetti();
    } else {
      this.isMatched = false;
    }
    this.cdr.detectChanges();
  }

  playStartSound() {
    const startSound = this.startSound.nativeElement;
    startSound.play();
  }

  playStopSound() {
    const stopSound = this.stopSound.nativeElement;
    stopSound.play();
  }

  playSuccessSound() {
    const successSound = this.successSound.nativeElement;
    successSound.play();
  }

  calculateWPM(text: string, timeTaken: number): number {
    const wordCount = text.split(' ').length;
    const minutes = timeTaken / 60;
    return Math.round(wordCount / minutes);
  }

  tryAgain() {
    this.isMatched = false;
    this.spokenWord = '';
    this.startListening();
  }
  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}
