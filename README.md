# ft_transcendence

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
