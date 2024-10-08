import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomePage } from './components/home-page.component';
import { WordSearch } from './components/search.component';

import { WordPage } from './components/word-page.component';
import { PronounciationPage } from './components/pronounciation-page.component';
import { PushButton } from './components/push-button.component';
import { WordHeaderComponent } from './components/word-header.component';
import { DictionaryRoutingModule } from './dictionary-routing.module';
import { DictionaryComponent } from './dictionary.component';
import { Header } from './components/header.component';
import { SpellBeeComponent } from './components/spell-bee.component';
import { DictionaryService } from './services/dictionary.service';
import { Loader } from './components/loader.component';

@NgModule({
  declarations: [
    DictionaryComponent,
    HomePage,
    Header,
    WordSearch,
    PushButton,
    WordPage,
    WordHeaderComponent,
    PronounciationPage,
    SpellBeeComponent,
    Loader
  ],
  imports: [
    HttpClientModule,
    DictionaryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,


  ],
  providers: [DictionaryService],
})
export class DictionaryModule {}
