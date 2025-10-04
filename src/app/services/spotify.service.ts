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

    private async auth() {
        const creds = btoa(`${environment.spotifyClientId}:${environment.spotifyClientSecret}`);
        const headers = new HttpHeaders({ 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' });
        const body = new URLSearchParams({ grant_type: 'client_credentials' });

        try {
            const res: any = await this.http.post('https://accounts.spotify.com/api/token', body.toString(), { headers }).toPromise();
            this.token.set(res.access_token);
            this.error.set(null); 
        } catch (err: any) {
            console.error('Erro de autenticação do Spotify:', err.error);
            this.error.set('Falha na autenticação do Spotify. Verifique Client ID e Secret.');
        }
    }

    private get headers() {
        return { headers: new HttpHeaders({ Authorization: `Bearer ${this.token()}` }) };
    }

    async searchArtists(query: string) {
        if (!query) return [];
        this.loading.set(true); this.error.set(null);

        if (!this.token()) {
            this.error.set('Token de acesso não disponível. Tentando reautenticar.');
            await this.auth(); 
            if (!this.token()) {
                this.loading.set(false);
                return [];
            }
        }

        try {
            const res: any = await this.http.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, this.headers).toPromise();
            return res.artists.items;
        } catch (err: any) {
            if (err.status === 401) {
                this.error.set('Token expirado ou inválido. Tentando autenticar novamente...');
                await this.auth();
            } else {
                this.error.set('Erro ao buscar artistas');
            }
            return [];
        } finally {
            this.loading.set(false);
        }
    }


    async getArtist(id: string) {
        this.loading.set(true); this.error.set(null);
        try {
            const [artist, albums] = await Promise.all([
                this.http.get(`https://api.spotify.com/v1/artists/${id}`, this.headers).toPromise(),
                this.http.get(`https://api.spotify.com/v1/artists/${id}/albums`, this.headers).toPromise()
            ]);
            return { artist, albums: (albums as any).items };
        } catch {
            this.error.set('Erro ao carregar artista');
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async getAlbum(id: string) {
        this.loading.set(true); this.error.set(null);
        try {
            const res: any = await this.http.get(`https://api.spotify.com/v1/albums/${id}`, this.headers).toPromise();
            return res;
        } catch {
            this.error.set('Erro ao carregar álbum');
            return null;
        } finally {
            this.loading.set(false);
        }
    }
}
