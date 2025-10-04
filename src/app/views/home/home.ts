import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  providers: [SpotifyService],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  query = '';
  artists = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searched = false;
  placeholder = 'https://via.placeholder.com/150?text=Artist';

  constructor(private spotify: SpotifyService, private router: Router) { }

  async search() {
    if (!this.query.trim()) return;

    this.loading.set(true);
    this.error.set(null);
    this.artists.set([]);
    this.searched = true;

    try {
      const result = await this.spotify.searchArtists(this.query);
      this.artists.set(result || []);
    } catch (err) {
      this.error.set('Erro ao buscar artistas. Tente novamente.');
      console.error('Erro na busca:', err);
    } finally {
      this.loading.set(false);
    }
  }
  goToArtist(id: string) {
    this.router.navigate(['/artist', id]);
  }
}
