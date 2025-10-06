# 🎧 NTT Music

Aplicação desenvolvida em **Angular 20.3.4**, inspirada na interface e funcionalidades do **Spotify**, como parte de uma avaliação técnica focada em **boas práticas, arquitetura moderna e uso de Signals**.

👉 **Deploy:** [ntt-data-ten.vercel.app](https://ntt-data-ten.vercel.app/)

---

## 🚀 Objetivo
O projeto consome a **API pública do Spotify** e permite:  
- Buscar artistas;  
- Visualizar detalhes de cada artista (imagem, gêneros, seguidores);  
- Listar álbuns e faixas de cada artista;  
- Ver detalhes completos de cada álbum.

A aplicação foi construída **sem bibliotecas externas de UI**, utilizando apenas **CSS puro**, com **design responsivo** adaptado para dispositivos móveis.

---

## 🧱 Tecnologias Utilizadas
- **Angular 20.3.4** (Standalone Components)  
- **Signals** para gerenciamento de estado reativo  
- **Spotify Web API** (Client Credentials Flow)  
- **Roteamento Angular** com três páginas principais:  
  - `/` → Página inicial de busca  
  - `/artist/:id` → Detalhes do artista  
  - `/album/:id` → Detalhes do álbum

---

## ⚙️ Instalação e Execução

Clone o repositório e instale as dependências:  
```bash
npm install
