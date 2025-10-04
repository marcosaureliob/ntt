import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-artist',
  imports: [CommonModule],
  templateUrl: './artist.html',
  styleUrl: './artist.css'
})
export class Artist {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private spotify = inject(SpotifyService);

  artist = signal<any>(null);
  albums = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  placeholder = 'https://via.placeholder.com/200x200?text=Artist';

  page = signal(0);
  limit = 8;

  get pagedAlbums() {
    const start = this.page() * this.limit;
    return this.albums().slice(start, start + this.limit);
  }

  get totalPages() {
    return Math.ceil(this.albums().length / this.limit);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadArtist(id);
  }

  async loadArtist(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.spotify.getArtist(id);
      if (data) {
        this.artist.set(data.artist);
        this.albums.set(data.albums);
      }
    } catch {
      this.error.set('Erro ao carregar artista');
    } finally {
      this.loading.set(false);
    }
  }

  nextPage() {
    if ((this.page() + 1) * this.limit < this.albums().length) {
      this.page.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
    }
  }

  goToAlbum(id: string) {
    this.router.navigate(['/album', id]);
  }
}
