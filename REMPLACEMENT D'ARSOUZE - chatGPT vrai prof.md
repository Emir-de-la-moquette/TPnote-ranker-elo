# Guide Technique : Implémentation du Serveur Realtime Elo Ranker

Ce guide détaille les étapes pour réaliser les deux premiers objectifs :
1. Créer un serveur HTTP en utilisant NestJS.
2. Créer un service de type Singleton pour stocker les données du classement en cache.

---

## 1. Initialisation du Serveur NestJS

L'architecture du projet est un monorepo géré avec `pnpm`. Le serveur doit être créé dans le dossier `apps/realtime-elo-ranker-server`.

### Prérequis
Assurez-vous d'avoir le NestJS CLI installé globalement :
```bash
npm install -g @nestjs/cli
```

### Création du projet
Placez-vous à la racine du monorepo et exécutez la commande suivante :
```bash
nest new apps/realtime-elo-ranker-server
```
*Choisissez `pnpm` comme gestionnaire de paquets quand cela vous sera demandé.*

### Structure recommandée
Une fois le projet créé, organisez les fichiers comme suit pour respecter les bonnes pratiques NestJS :
- `src/rankings/` : Module pour la gestion du classement.
  - `rankings.module.ts`
  - `rankings.controller.ts`
  - `rankings.service.ts` (Le Singleton)
- `src/players/` : Module pour la gestion des joueurs.
  - `players.module.ts`
  - `players.controller.ts`
  - `players.service.ts`

---

## 2. Création du Service Singleton (Cache Classement)

Dans NestJS, les services sont des Singletons par défaut au sein de leur module.

### Génération du module et du service
```bash
cd apps/realtime-elo-ranker-server
nest generate module rankings
nest generate service rankings
```

### Implémentation du Cache (RankingsService)
Modifiez `src/rankings/rankings.service.ts` pour stocker les données en mémoire.

```typescript
import { Injectable } from '@nestjs/common';

export interface PlayerRanking {
  id: string;
  rank: number;
}

@Injectable()
export class RankingsService {
  // Le cache en mémoire
  private rankingCache: Map<string, number> = new Map();

  // Récupérer tout le classement
  getAllRankings(): PlayerRanking[] {
    return Array.from(this.rankingCache.entries()).map(([id, rank]) => ({
      id,
      rank,
    }));
  }

  // Mettre à jour ou ajouter un joueur
  updateRanking(id: string, rank: number) {
    this.rankingCache.set(id, rank);
  }

  // Récupérer le rang d'un seul joueur
  getRanking(id: string): number | undefined {
    return this.rankingCache.get(id);
  }
}
```

---

## 3. Configuration et Lancement

### Intégration dans le Monorepo
Vérifiez que le `package.json` à la racine contient bien le script pour lancer le serveur. Si non, ajoutez-le :
```json
"scripts": {
  "apps:server:dev": "pnpm run --filter realtime-elo-ranker-server start:dev"
}
```

### Lancement
Pour lancer le serveur en mode développement avec hot-reload :
```bash
pnpm run apps:server:dev
```

---

Parfait, ton guide est **clair, propre et bien structuré** 👍
Je te propose une **suite cohérente**, dans le même ton technique, qui couvre **toutes les consignes restantes** sans entrer trop tôt dans l’implémentation lourde.

---


## 4. Gestion de la Persistance des Joueurs

Le stockage des joueurs doit être **persistant**, contrairement au classement qui reste en cache mémoire.

### Choix de la solution

Deux solutions sont possibles :

* **Prisma** (recommandé)
* TypeORM

Dans ce guide, Prisma est utilisé pour sa simplicité et son intégration avec NestJS.

---

### Installation de Prisma

Depuis `apps/realtime-elo-ranker-server` :

```bash
pnpm add prisma @prisma/client
pnpm prisma init
```

Cela crée :

* `prisma/schema.prisma`
* `.env`

---

### Modèle Player

Dans `prisma/schema.prisma` :

```prisma
model Player {
  id        String  @id @default(uuid())
  name      String
  elo       Int     @default(1000)
  createdAt DateTime @default(now())
}
```

Appliquer la migration :

```bash
pnpm prisma migrate dev --name init
```

---

### PlayersService (Accès base de données)

`src/players/players.service.ts` :

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.player.findMany();
  }

  findById(id: string) {
    return this.prisma.player.findUnique({ where: { id } });
  }

  updateElo(id: string, elo: number) {
    return this.prisma.player.update({
      where: { id },
      data: { elo },
    });
  }
}
```

---

## 5. Logique Métier : Calcul du Classement Elo

La logique de calcul Elo est centralisée dans le `RankingsService`.

### Formule Elo

```ts
expectedScore = 1 / (1 + 10 ^ ((opponentElo - playerElo) / 400))
newElo = oldElo + K * (score - expectedScore)
```

---

### Implémentation

Dans `rankings.service.ts` :

```ts
calculateElo(
  playerElo: number,
  opponentElo: number,
  score: number,
  kFactor = 32,
): number {
  const expected =
    1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));

  return Math.round(playerElo + kFactor * (score - expected));
}
```

Cette méthode est utilisée lors des mises à jour de classement.

---

## 6. Notifications Temps Réel avec EventEmitter

NestJS propose un système d’événements simple et efficace.

### Installation

```bash
pnpm add @nestjs/event-emitter
```

---

### Configuration

Dans `app.module.ts` :

```ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
})
export class AppModule {}
```

---

### Émission d’un événement

Dans `RankingsService` :

```ts
constructor(private eventEmitter: EventEmitter2) {}

updateRanking(id: string, rank: number) {
  this.rankingCache.set(id, rank);

  this.eventEmitter.emit('ranking.updated', {
    playerId: id,
    rank,
  });
}
```

---

### Écoute des événements

Créer un listener :

```ts
@Injectable()
export class RankingListener {
  @OnEvent('ranking.updated')
  handleRankingUpdate(payload: any) {
    console.log('Ranking updated:', payload);
  }
}
```

---

## 7. Implémentation de l’API (Swagger)

L’API doit **respecter strictement** le Swagger fourni.

### Bonnes pratiques

* Un endpoint = une méthode de controller
* La logique métier reste dans les services
* Utilisation de DTOs pour valider les entrées

---

### Exemple de Controller

```ts
@Get(':id')
getPlayerRanking(@Param('id') id: string) {
  return this.rankingsService.getRanking(id);
}
```

---

### Swagger (OpenAPI)

Installation :

```bash
pnpm add @nestjs/swagger swagger-ui-express
```

Configuration :

```ts
const config = new DocumentBuilder()
  .setTitle('Realtime Elo Ranker')
  .setVersion('1.0')
  .build();
```

---

## 8. Tests Unitaires et d’Intégration

### Tests unitaires

* Tester les services indépendamment
* Mock des dépendances (Prisma, EventEmitter)

Exemple :

```ts
describe('RankingsService', () => {
  it('should calculate correct elo', () => {
    const elo = service.calculateElo(1000, 1000, 1);
    expect(elo).toBeGreaterThan(1000);
  });
});
```

---

### Tests d’intégration

* Tester les endpoints HTTP
* Utiliser `supertest`

```bash
pnpm add -D supertest
```

---

## Conclusion

À ce stade, le serveur :

* expose une API conforme au Swagger
* calcule et met à jour les classements Elo
* stocke les joueurs en base
* émet des événements temps réel
* est testé et maintenable

---

Si tu veux, je peux :

* adapter ce guide **mot pour mot** à ton Swagger
* simplifier pour un **rendu académique**
* ou te faire une **checklist de validation des consignes** ✔️
