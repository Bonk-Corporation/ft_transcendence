# ft_transcendence

## Introduction
Best transcendence ever, made by students from 42LeHavre.
The goal of this project is to make a single page application displaying at least a Pong game.
But we decided to get more ambitious...
![Screenshot from 2024-05-31 20-08-24](https://github.com/Bonk-Corporation/ft_transcendence/assets/114430228/a35969cd-3bf0-4385-aa9a-3da83de064f2)


## General Requirements
- Create an API app on 42 intra
- Edit your redirect URI to ```https://localhost:8443/auth/42``` in production mode or to ```http://localhost:8000/auth/42``` in dev mode
- Copy .env.example into a .env file

## Development Usage
- ```nix-shell```
- ```python backend/manage.py migrate```

 ## Production Usage
 - ```docker-compose up```

## Technologies
- React
- Tailwind
- Django
- Docker

## Modules
- Backend **M**
- Front-end **m**
- Database **m**
- User management **M**
- OAuth 2.0 - API 42 **M**
- Networked multiplayer **M**
- More than 2 players **M**
- Bonk **M**
- Chat **M**
- RGPD **m**
- Interbrowser **m**
- Server side pong **M**

**M**: major module - **m**: minor module

### Maybe
- Personnalisation (SKIN) ? m
- 2FA ? M
- Responsive m
- CLI m

## Norm
### Commit messages
Commit messages should apply to the following norm:
- ```- | <commit>``` : Deleted something
- ```~ | <commit>``` : Modified something
- ```+ | <commit>``` : Added something

This commit format follow the [DinoFormat](https://github.com/DinoMalin/DinoFormat) rules

### Code Formatter
- **Javascript**: Prettier
- **Python**: Black
