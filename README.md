# ft_transcendence

## General Requirements
- Create an API app on 42 intra
- Need ```/auth/42``` at the end of redirect URI on 42 intra
- Copy backend/.env.example into a backend/.env file

## Developpement Usage
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
- User managment **M**
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

### Code Formatter
- **Javascript**: Prettier
- **Python**: Black
