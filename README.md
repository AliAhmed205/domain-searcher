# Domain Searcher

Domain Searcher is een applicatie waarmee gebruikers domeinnamen kunnen zoeken, suggesties kunnen krijgen, en deze informatie wordt opgeslagen in een MongoDB-database. De applicatie bestaat uit een **React-frontend** en een **Node.js-backend** met een verbinding naar MongoDB.

---

## Installatiehandleiding

### 1. Vereisten
Zorg ervoor dat je de volgende software geïnstalleerd hebt:
- **Node.js** (versie 14.x of hoger)
- **npm** (of Yarn)
- **MongoDB Atlas-account** (of een lokale MongoDB-server)
- **Git** (om de repository te klonen)

---

### 2. Clone de repository
Kloon het project naar je lokale machine:

```bash
git clone <repository-url>
cd domain-searcher
```

### 3. Configuratie

# ```BACK-END CONFIGURATIE```

Navigeer naar de api map:

```bash
cd api
```
Maak een ``.env`` bestand aan:

```bash
touch .env
```

Vul het ``.env`` bestand met de volgende variabelen (pas aan naar jouw instellingen):

```bash
MINTY_BASE_URL=https://dev.api.mintycloud.nl/api/v2.1
MINTY_AUTH=Basic <jouw-minty-auth>
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

Installeer de benodigde dependencies:

```bash
npm install 
```

Start de back-end! 

```bash 
npm run dev 
```

De backend draait nu op ``http://localhost:1122``.

# ```FRONT END CONFIGURATIE```

Ga terug naar de hoofdmap:

```bash
cd ../
```

Installeer de frontend dependencies:

```bash
npm install
```

Start de frontend

```bash
npm start
```

De frontend draait nu op http://localhost:3000.

Let op: Zorg ervoor dat de backend draait op ``http://localhost:1122``, omdat de frontend hardcoded verzoeken naar die URL stuurt.
Als alles zorgvuldig is nagelopen en uitgevoerd, zou de website zoals in de video moeten werken:
