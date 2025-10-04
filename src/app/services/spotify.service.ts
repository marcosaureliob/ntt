import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private token = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.auth();
  }

  private async ensureAuthenticated() {
    if (!this.token()) {
      await this.auth();
    }
  }


  private async auth(): Promise<void> {
    const creds = btoa(`${environment.spotifyClientId}:${environment.spotifyClientSecret}`);
    const headers = new HttpHeaders({ 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    try {
      const res: any = await this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers }).toPromise();
      this.token.set(res.access_token);
      this.error.set(null);
    } catch (err: any) {
      console.error('Erro de autenticação do Spotify:', err);
      this.error.set('Falha na autenticação do Spotify. Verifique Client ID e Secret.');
      this.token.set(null);
    }
  }

  private get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.token()}` }) };
  }


  async searchArtists(query: string): Promise<any[]> {
    await this.ensureAuthenticated();
    if (!query) return [];
    this.loading.set(true); this.error.set(null);

    try {
      const res: any = await this.http.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, this.headers).toPromise();
      return res.artists.items;
    } catch (err: any) {
      if (err.status === 401) {
        this.error.set('Token expirado ou inválido. Tentando autenticar novamente...');
        await this.auth();

        if (this.token()) {
          try {
            const res: any = await this.http.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, this.headers).toPromise();
            return res.artists.items;
          } catch (retryErr: any) {
            this.error.set('Falha na reautenticação e na nova tentativa de busca.');
            return [];
          }
        } else {
          this.error.set('Falha na autenticação. Não foi possível buscar artistas.');
          return [];
        }
      } else {
        this.error.set('Erro ao buscar artistas');
        return [];
      }
    } finally {
      this.loading.set(false);
    }
  }


  async getArtist(id: string): Promise<any> {
    await this.ensureAuthenticated();
    this.loading.set(true); this.error.set(null);

    try {
      const [artist, albums] = await this.fetchArtistData(id);
      return { artist, albums: (albums as any).items };
    } catch (initialErr: any) {
      if (initialErr.status === 401) {
        this.error.set('Token expirado ou inválido. Tentando autenticar novamente...');
        await this.auth();

        if (this.token()) {
          try {
            const [artist, albums] = await this.fetchArtistData(id);
            return { artist, albums: (albums as any).items };
          } catch (retryErr: any) {
            this.error.set('Falha na reautenticação e na nova tentativa de carregar artista.');
            return null;
          }
        } else {
          this.error.set('Falha na autenticação. Não foi possível carregar artista.');
          return null;
        }
      } else {
        this.error.set('Erro ao carregar artista');
        return null;
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchArtistData(id: string) {
    return Promise.all([
      this.http.get(`https://api.spotify.com/v1/artists/${id}`, this.headers).toPromise(),
      this.http.get(`https://api.spotify.com/v1/artists/${id}/albums`, this.headers).toPromise()
    ]);
  }


  async getAlbum(id: string): Promise<any> {
    await this.ensureAuthenticated();
    this.loading.set(true); this.error.set(null);

    try {
      const res: any = await this.http.get(`https://api.spotify.com/v1/albums/${id}`, this.headers).toPromise();
      return res;
    } catch (initialErr: any) {
      if (initialErr.status === 401) {
        this.error.set('Token expirado ou inválido. Tentando autenticar novamente...');
        await this.auth();

        if (this.token()) {
          try {
            const res: any = await this.http.get(`https://api.spotify.com/v1/albums/${id}`, this.headers).toPromise();
            return res;
          } catch (retryErr: any) {
            this.error.set('Falha na reautenticação e na nova tentativa de carregar álbum.');
            return null;
          }
        } else {
          this.error.set('Falha na autenticação. Não foi possível carregar álbum.');
          return null;
        }
      } else {
        this.error.set('Erro ao carregar álbum');
        return null;
      }
    } finally {
      this.loading.set(false);
    }
  }
}