import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'word-header',
  template: `
    <div class="word-header">
      <div class="word-info">
        <h1 class="word-title">
          {{ wordDetails.word }}
          <button *ngIf="wordDetails.CEFR" class="play-audio-btn" (click)="playAudio()">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </h1>
        <div *ngIf="wordDetails.CEFR" class="phonetics">
          <span class="phonetics-text">{{ wordDetails.CEFR?.Phonetics }}</span>
          <span class="level-chip">{{ wordDetails.CEFR?.Level }}</span>
        </div>
      </div>
      <push-button
        *ngIf="!isWordOfTheDay && wordDetails.CEFR"
        [buttonText]="'Practice'"
        (buttonClick)="practiceWord.emit(wordDetails.word)"
      ></push-button>
      <audio #audioPlayer [src]="wordDetails.CEFR?.Voice"></audio>
    </div>
  `,
  styles: [
    `
      .word-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 4px solid #eee;
      }

      .word-info {
        display: flex;
        flex-direction: column;
      }

      .word-title {
        font-size: 2rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .play-audio-btn {
        background-color: transparent;
        color: #1A237E;
        border: none;
        cursor: pointer;
      }

      .play-audio-btn i {
        font-size: 1.2rem;
      }

      .phonetics {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .phonetics-text {
        font-size: 1.2rem;
        color: black;
      }

      .level-chip {
        background-color: #fbe9e7;
        color: #bf360c;
        padding: 3px 9px;
        border-radius: 14px;
        font-size: 10px;
        font-weight: bold;
      }
    `,
  ],
})
export class WordHeaderComponent {
  @Input() wordDetails: any;
  @Input() isWordOfTheDay: boolean = false;
  @Output() practiceWord = new EventEmitter<string>();

  @ViewChild('audioPlayer') audioPlayer: any;

  playAudio() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
}
