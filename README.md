🎧 NTT Music

Aplicação desenvolvida em Angular 20.3.4, inspirada na interface e funcionalidades do Spotify, como parte de uma avaliação técnica focada em boas práticas, arquitetura moderna e uso de Signals.

👉 Deploy: ntt-data-ten.vercel.app

🚀 Objetivo

O projeto consome a API pública do Spotify e permite:

Buscar artistas;

Visualizar detalhes de cada artista (imagem, gêneros, seguidores);

Listar álbuns e faixas de cada artista;

Ver detalhes completos de cada álbum.

A aplicação foi construída sem bibliotecas externas de UI, utilizando apenas CSS puro, com design responsivo adaptado para dispositivos móveis.

🧱 Tecnologias Utilizadas

Angular 20.3.4 (Standalone Components)

Signals para gerenciamento de estado reativo

Spotify Web API (Client Credentials Flow)

Roteamento Angular com três páginas principais:

/ → Página inicial de busca

/artist/:id → Detalhes do artista

/album/:id → Detalhes do álbum

⚙️ Instalação e Execução

Clone o repositório e instale as dependências:

npm install


Crie o arquivo src/environments/environment.ts com suas credenciais do Spotify:

export const environment = {
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET'
};


Inicie o servidor de desenvolvimento:

ng serve


Acesse o projeto em:
http://localhost:4200

🧭 Estrutura de Rotas
import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Artist } from './views/artist/artist';
import { Album } from './views/album/album';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'artist/:id', component: Artist },
  { path: 'album/:id', component: Album },
];

🧩 Funcionalidades Principais

Busca dinâmica de artistas com estado de carregamento.

Exibição de mensagens quando não há resultados.

Detalhes completos do artista e seus álbuns.

Página do álbum com lista de faixas.

Tratamento de erros para requisições da API.

Layout limpo e responsivo (desktop e mobile).

📦 Build e Deploy

Gerar build de produção:

ng build


O projeto está disponível em produção pela Vercel:
🔗 https://ntt-data-ten.vercel.app/

🧠 Avaliação Técnica

Tema: Frontend Angular (Versão Spotify)
Pontos avaliados:

Arquitetura moderna com Standalone Components;

Uso de Signals para reatividade;

Boas práticas (Clean Code e SOLID);

CSS puro e criatividade de layout;

Consumo e tratamento de erros de API;

Deploy funcional e responsivo.

Feito com Angular, CSS e música em mente 🎶
