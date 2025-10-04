import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Artist } from './views/artist/artist';
import { Album } from './views/album/album';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'artist/:id', component: Artist },
  { path: 'album/:id', component: Album },
];
