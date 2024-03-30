# Initialisation des node_modules pour chaque projet

```bash
cd backend
npm i
cd ../engine
npm i
cd ../engine_demo
npm i
cd ../web/chess-tpi
npm i	
```

> Le script utilisé durant la démo du moteur est dans le dossier `engine_demo`
> Il est possible de l'exécuter avec la commande `cd engine_demo` puis `./demo.ps1`

# TODO List pour le moteur de jeu

- [x] Engine
  - [x] Créer les pièces
    - [x] Template
    - [x] Pions
    - [x] Tours
    - [x] Cavaliers
    - [x] Fous
    - [x] Reine
    - [x] Roi
  - [x] Créer le plateau
  - [x] Créer les règles de déplacement
	- [x] Pions
    	- [x] Déplacements
    	- [x] Captures
	- [x] Tours
	- [x] Cavaliers
	- [x] Fous
	- [x] Reine
	- [x] Roi
  - [x] Collisions
	- [x] Pions
	- [x] Tours
	- [x] Cavaliers
	- [x] Fous
	- [x] Reine
	- [x] Roi
  - [x] Déplacement spéciaux
    - [x] Double déplacement des pions
    - [x] Roque
      - [x] King-side
      - [x] Queen-side
    - [x] En passant
  - [x] Détection d'échec
    - [x] Concept d'échec
    - [x] Anti autocheck
    - [x] Checkmate
  - [x] Promotion
  - [x] Égalités
    - [x] Stalemate
    - [x] 50 coups
    - [x] Triple répétition
    - [x] Matériel insuffisant
  - [x] Tests unitaires