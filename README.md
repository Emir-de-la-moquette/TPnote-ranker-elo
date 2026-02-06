# TP Note JS elo ranker

Shanka Clermont


### Base de données
Prisma 6.11 (basé sur les connaissances de la SAE)

## Installation du projet

```sh
git clone https://github.com/Emir-de-la-moquette/TPnote-ranker-elo.git

cd ./TPnote-ranker-elo

pnpm install


# Migration joueur / match si aucune migration n'existe
pnpm prisma migrate dev --name init-player-match


# Sinon, utiliser la migration joueur / match déjà réalisée (meilleure option)
pnpm prisma migrate deploy


# Si les migrations sont déjà appliquées mais que le client n’est pas à jour :

pnpm prisma generate


## Lancer le projet

# build l'ui
pnpm run libs:ui:build

# Lancer le client
pnpm run apps:client:start  # lance sur localhost:3001

# Puis sur un second terminal 


# Lancer le serveur
pnpm run apps:server:start 
```



## Objectifs

- [x] Créer un serveur HTTP en utilisant NestJS
- [x] Créer un service de type Singleton pour stocker des données du classement en cache
- [x] Créer un service pour écrire et lire les données des joueurs en base de données (prisma)
- [x] Ajouter la logique métier pour mettre à jour le classement des joueurs
- [x] Ajouter un EventEmitter pour émettre des notifications en temps réel
- [x] Implémenter l'API décrite par le Swagger fourni
- [x] Tester l'application avec des tests unitaires et des tests d'intégration

## Fonctionnalités

- [x] Un joueur peut etre créer avec un elo initial de qui est la moyen de tous les elos des joueurs existants, et une valeur par defaut au cas où.
- [x] Un match peut etre créer entre deux joueurs.
- [x] Visualiser les joueurs et leurs elos.
- [x] Un historique des matchs est stocké.
- [x] Les elos des joueurs sont mis à jour en temps réel.
- [x] Les joueurs sont stocké en mémoire cache et en base de données.
- [ ] match aleatoire entre deux joueurs toutes les XX secondes.
- [ ] Simulation de match.

## Tests
lancer les tests
```sh
# À la racine du projet
clear ; pnpm apps:server:test

lancer le coverage

# À la racine du projet
clear ; pnpm apps:server:test:coverage
```
Résultats

![alt text](<coverage tests.png>)