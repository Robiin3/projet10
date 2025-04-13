# Automatisez des tests pour une boutique en ligne
## Description du projet
Eco Bliss Bath est une start-up spécialisée dans la vente de produits de beauté écoresponsables dont le produit principal est un savon solide.
La boutique prépare un site de vente en ligne, dont la première version doit être testée.


## Installation du projet

**Prérequis :**

Installer
- Node.js
- Docker
- NPM
- Cypress
- Mochawesome


**1. Téléchargez ou clonez le dépôt**

**2. Depuis un terminal ouert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`**

**3. Ouvrez le site depuis la page http://localhost:8080**

Nb : à l'étape 2, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.

## Utilisation

**1. Exécution des tests**

Depuis un terminal ouvert dans le dossier du projet, saisir les commandes :

- `npx cypress run` pour exécuter tous les tests Cypress en mode non interactif
- `npx cypress open` pour ouvrir l'interface graphique de Cypress. Cliquer sur E2E testing, choisir le navigateur à utiliser, puis sélectionner le fichier de test à exécuter.

**2. Génération de rapports**

Après avoir exécuté les tests via `npx cypress run`, les rapports de tests sont disponibles dans le dossier cypress/reports. Il suffit d'ouvrir les pages HTML correspondantes (_mochawesome_XXX.html_).
Des captures d'écran des tests en échec sont présentes dans le dossier cypress/screenshots.

**3. Connexion au site web**

- identifiant: test2@test.fr 
- mot de passe: testtest

**4. API**

Swagger: http://localhost:8081/api/doc

**5. Fermeture du projet**

Saisir la commande : `docker-compose down`
