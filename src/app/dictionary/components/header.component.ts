import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
   <header>
    <div routerLink="/" class="brand">
      <span class="title">Dictionary</span>
    </div>
    <word-search></word-search>
   </header>
  `,
  styles: [`
    header {
      background-color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #eeeeee;
    }

    .brand {
      cursor:pointer;
      display: flex;
      align-items: center;
      gap: 10px; /* Space between logo and text */
      font-size: 1.5rem; /* Slightly smaller font for a thin appearance */
      color: #424242; /* Material grey for text */
    }

    .logo {
      height: 30px; /* Smaller logo for a compact look */
      width: 30px;
    }

    .title {
      font-weight: 500; /* Medium weight for a clean look */
      color: #0d47a1; /* Dark blue for text */
    }

    /* Responsive Design: Mobile */
    @media (max-width: 768px) {
      header {
        padding: 10px 15px; /* Keep padding small on mobile */
      }

      .brand {
        font-size: 1.3rem; /* Slightly smaller font on mobile */
        gap: 8px;
      }

      .logo {
        height: 25px; /* Smaller logo for mobile */
        width: 25px;
      }
    }

    /* Responsive Design: Small Mobile */
    @media (max-width: 480px) {
      header {
        padding: 8px;
      }

      .brand {
        font-size: 1.2rem; /* Smaller font size on small mobile */
        gap: 6px;
      }

      .logo {
        height: 20px;
        width: 20px;
      }
    }
  `]
})
export class Header implements OnInit {
  ngOnInit(): void {}
}
