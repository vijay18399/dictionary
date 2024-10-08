import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './components/home-page.component';
import { WordPage } from './components/word-page.component';
import { PronounciationPage } from './components/pronounciation-page.component';
import { DictionaryComponent } from './dictionary.component';
import { SpellBeeComponent } from './components/spell-bee.component';

const routes: Routes = [
   {
     path:'',
     component: DictionaryComponent,
     children:[
      { path: '', component: HomePage },
      { path: 'word/:word', component: WordPage },
      { path: 'practice/:word', component: PronounciationPage },
      { path: 'spell-bee', component: SpellBeeComponent },
     ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryRoutingModule {}
