# 💬 Application de chat temps réel (Socket.IO)

## 📝 Description

Cette application est un **serveur de chat en temps réel** développé avec **Node.js**, **Express** et **Socket.IO**.

Elle permet à plusieurs utilisateurs de se connecter simultanément, d’échanger des messages publics, d’envoyer des **messages privés**, et de voir en temps réel les événements de connexion, déconnexion et d’écriture ("typing").

Le frontend est servi via le dossier `Public`, et la communication temps réel est assurée grâce à **WebSockets** avec Socket.IO.

---

## 🚀 Fonctionnalités

* 🔌 Connexion de plusieurs utilisateurs en temps réel
* 👤 Définition d’un nom d’utilisateur
* 📋 Liste des utilisateurs connectés mise à jour en temps réel
* 💬 Messagerie publique (chat global)
* 🔒 Messagerie privée entre utilisateurs
* ✍️ Indicateur *“est en train d’écrire”*
* 🔔 Notifications de connexion et déconnexion

---

## 🛠️ Technologies utilisées

### Backend

* **Node.js**
* **Express.js**
* **Socket.IO**
* **HTTP Server (Node)**

### Autres

* **JavaScript**
* **Path** (gestion des chemins)
* **JSON**

---

## 📁 Structure du projet (simplifiée)

```
chat-socket-io/
│
├── Public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation et lancement

### Prérequis

* Node.js
* npm

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/votre-username/chat-socket-io.git
cd chat-socket-io
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Lancer le serveur

```bash
node server.js
```

Le serveur démarre sur :

```
http://localhost:3000
```

---

## 🔄 Fonctionnement temps réel

* Le serveur HTTP est créé manuellement afin d’y rattacher Socket.IO
* Chaque utilisateur reçoit un **socket.id** unique
* Les utilisateurs sont stockés en mémoire dans un tableau (`userConnected`)
* Les événements Socket.IO gérés :

  * `connection` / `disconnect`
  * `set_username`
  * `chat_message`
  * `private_message`
  * `typing_start` / `typing_stop`

---

## ⚠️ Limitations actuelles

* Les utilisateurs ne sont pas persistés (stockage en mémoire uniquement)
* Pas d’authentification
* Pas de base de données
* Pas de gestion avancée des erreurs

---

## 📌 Améliorations possibles

* Ajout d’une base de données (MongoDB)
* Authentification utilisateur
* Salons de discussion (rooms)
* Historique des messages
* Gestion des statuts (online / offline)
* Interface frontend plus avancée

---

## 👨‍💻 Contexte du projet

Projet réalisé dans un cadre **pédagogique**, afin de :

* comprendre le fonctionnement des **WebSockets**
* manipuler **Socket.IO** côté serveur
* gérer des événements temps réel
* structurer une application Node.js simple

---<img width="1205" height="875" alt="Capture d’écran 2026-02-07 165342" src="https://github.com/user-attachments/assets/075d5515-01aa-4e2c-8d82-9be010c15e77" />


## 📄 Licence

Projet open-source à but pédagogique.

