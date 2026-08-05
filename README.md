---
# E-Commerce Vini & Alcolici - Frontend

Questa sezione è dedicata allo sviluppo dell'interfaccia utente (Client-Side) dell'applicazione.

---

## Tecnologie & Strumenti

* **Framework:** Angular (v17+)
* **Stato del progetto:** In fase di chiusura.
---

## Struttura del Progetto

Il codice sorgente è organizzato nelle seguenti cartelle principali:

* **`components`**: contiene i componenti riutilizzabili all'interno dell'applicazione (es. card, elementi di UI condivisi tra più pagine), pensati per essere generici e indipendenti dal contesto in cui vengono usati.
* **`core`**: raccoglie tutta la parte logica trasversale dell'applicazione, non legata direttamente alla UI. In particolare:
  * **Interceptor**: gestiscono in modo centralizzato le richieste/risposte HTTP (es. aggiunta del token di autenticazione, gestione degli errori, refresh token).
  * **Guard**: controllano l'accesso alle rotte in base allo stato di autenticazione/ruolo dell'utente (es. `adminGuard`, `customerGuard`).
  * **Security**: logica legata all'autenticazione e all'autorizzazione lato client, quindi login, logout e refresh token' all interno di `tokenService`.
  * **Models**: definizione delle interfacce/tipi TypeScript che rappresentano le entità dell'applicazione.
  * **Services**: servizi Angular che comunicano con il backend e incapsulano la logica di business condivisa.
* **`dialogs`**: contiene i componenti di dialogo/modale richiamati nelle varie parti del progetto (es. conferme, form popup).
* **`ui/pages`**: le pagine vere e proprie dell'applicazione, cioè i componenti associati alle rotte principali (homepage, registration, gestione-venditori, ecc.).
* **`settings`**: componenti e logica relativi alle impostazioni dell'applicazione/utente.

## Routing e Lazy Loading

Le rotte dell'applicazione sono definite in `app.routes.ts` utilizzando il **lazy loading**: ogni pagina viene caricata solo quando l'utente naviga effettivamente verso quella rotta, riducendo la dimensione del bundle iniziale e migliorando i tempi di caricamento dell'app. Le rotte protette sono inoltre associate ai guard definiti in `core` (`adminGuard`, `customerGuard`, `sellerGuard`) per limitare l'accesso in base al ruolo dell'utente autenticato.
