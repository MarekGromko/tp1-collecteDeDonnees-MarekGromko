# TP1 - Collecte de données

_presented by_
- Marek Gromko

_presented for_
- Sara Bouhmeraz

---

## Table of Contents
- [Structure](#structure)
- [Features](#features)
- [Installation](#getting-started)
- [Usage](#usage)
- ~~API Reference~~

---

## Structure

```
project-root/
│
├── data/               # database file & mock data
├── logs/ (optional)    # logs files, only when running the app
├── dist/ (optional)    # result of building the app
├── src/
│   ├── controller/     # Controller called by routes
│   ├── core/           # Interfaces & types
│   ├── data/           # Class for data access (Data Layer)
│   ├── middleware/     # routes middleware
│   ├── model/          # Class modeling the application data
│   ├── route/          # router for all the functionalities
│   ├── service/        # All the operational logic
│   ├── utility/        # Helper & Utility class
│   │
│   ├── app.ts              # entry point
│   ├── container.base.ts   # DI base container
│   ├── container.final.ts  # DI final container
│
├── .env (optional)     # Env variables (loaded on runtime)
├── .gitignore
├── example.env         # All the usefull environnment variables
├── esbuild.config.js   # Build configuration
├── package.json
├── package.lock.json
├── README.md
├── tp1.postman_collection.json     # Collection Postman
├── tsconfig.json

```
---

## Features

- [x] Stack
    - using `Typescript` for coding
    - \***ADDON**\* using `esbuild` to compile the application rather than `ts-node` or `ts-node-dev`, this allow for greater use of typescript functionalities & offer even better performance than other options.
    - \***ADDON**\* using `snap/ts-inject` to have a fully functional DI & IOC container in the application, while it wasnt requested, I took the freedom to use it to simplify the different dependency between all the components.
    - using `Express` for routing
    - using `Winston` for logging
- [x] Conception
    - Models (Media, Film, Serie, Season, Episode, User)
    - Services (...)
    - Controllers (...)
    - Middlewares (...)
- [x] Routes
    - `GET  /api/medias`
    - `GET  /api/medias/:id`
    - `POST /api/medias` (require auth & role `admin`)
    - `PUT  /api/medias/:id` (require auth & role `admin`)
    - `DELETE /api/medias/:id` (require auth & role `admin`)
    - `GET /api/series/:id/episodes`
    - `GET /api/users/:id/medias`
- [x] Regex
    - field `title`
    - field `platform`
    - field `duration`
    - field `status`
- [x] Persistence
    - mock data in `data/db.init.json`
    - integration using `src/data/DataLayerImpl`
- [x] Test Postman
    - `GET /medias`
    - `GET /medias?type=serie&genre=drama&year=2020`
    - `POST /films`
    - `POST /series` 
    - `POST /seasons`
    - `POST /episodes`
    - `PATCH /episodes/:id`
    - `POST /films` (titre manquant) 
    - `POST /films` (titre invalide) 
    - `POST /films` (année future)

---
## Installation

```bash
git clone https://github.com/MarekGromko/tp1-collecteDeDonnees-MarekGromko.git
cd tp1-collecteDeDonnees-MarekGromko
npm install
```

### Usage

First, checkout the file `example.env` to setup the the environnment variables needed

```bash
npm run start # start the nodemon server
# or
npm run build # build the app in dist/
```