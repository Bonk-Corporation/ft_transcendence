FROM nixos/nix

COPY . /app

WORKDIR /app

CMD ["nix-shell", "--arg", "prod", "true", "--run", "make"]
