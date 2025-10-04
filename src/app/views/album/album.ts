import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);

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

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  goToTrack(href: string) {
    window.open(href, '_blank');
  }

  goBack() {
    this.router.navigate(['']);
  }
}
