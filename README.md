<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex Backend

## Para desarrollo

1. Clonar el repositorio.
2. Ejecutar ``pnpm install``
3. Instalar NestJS ``sudo npm i -g @nestjs/cli``
4. Inicializamos la base de datos de MongoDB Ejecutar el comando
   ``
   podman-compose up -d
   ``
   ó
   ``
   docker-compose up -d
   ``
5. Renombrar y editar el archivo `.env.template` a `.env` y configurar las variables solicitadas.

6. Ejecutamos ```pnpm start:dev```

7. Ejecutamos el Seed (datos de prueba)
   ``http://localhost:3000/api/v2/seed``

### Stack

- MongoDB 5
- NestJS
