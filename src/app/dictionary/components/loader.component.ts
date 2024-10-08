import { Component } from '@angular/core';

@Component({
  selector: 'loader',
  template: `
    <div class="loader-container">
      <div class="skeleton-word"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-paragraph"></div>
      <div class="skeleton-paragraph"></div>
      <div class="skeleton-paragraph"></div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
      .loader-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 600px;
        background-color: #fff;
        border-radius: 8px;
        padding: 10px;
        margin: 0 auto;
      }

      .skeleton-word {
        width: 40%;
        height: 42px;
        background-color: #e0e0e0;
        border-radius: 4px;
      }

      .skeleton-line {
        border-bottom: 4px solid #eee;
      }

      .skeleton-paragraph {
        width: 100%;
        height: 12px;
        background-color: #e0e0e0;
        border-radius: 4px;
      }

      @media (max-width: 600px) {
        .loader-container {
          width: 100%; /* Make it responsive by adjusting width for smaller screens */
        }

        .skeleton-word {
          width: 60%; /* Adjust the width of skeleton word for smaller screens */
        }

        .skeleton-paragraph {
          height: 14px; /* Slightly increase the height for better visibility on small screens */
        }
      }
    `,
  ],
})
export class Loader {
  loadingText: string = 'Loading';
}
