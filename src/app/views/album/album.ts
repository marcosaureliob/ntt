import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  standalone: true,
  selector: 'app-album',
  imports: [CommonModule],
  templateUrl: './album.html',
  styleUrl: './album.css'
})
export class Album {
  route = inject(ActivatedRoute);
  spotify = inject(SpotifyService);
  album = signal<any>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  placeholder = 'https://via.placeholder.com/200x200?text=Album';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadAlbum(id);
  }

  async loadAlbum(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.spotify.getAlbum(id);
      this.album.set(data);
    } catch {
      this.error.set('Erro ao carregar álbum');
    } finally {
      this.loading.set(false);
    }
  }
}
