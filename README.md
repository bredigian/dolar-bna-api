# Dolar BNA API Scrapper

Scrapper API desarrollado con Express.js para la obtención de datos históricos del valor del dolar oficial de BNA.

## Tecnologías

- Node.js
- Express.js
- TypeScript
- Playwright
- MongoDB
- Docker

## Características

- Obtención de datos del dolar del día referenciado mediante parametros.
- Almacenamiento de datos en base de datos Mongo.
- Persistencia de datos con Docker Volumes.

## Requisitos

- Docker Desktop

## Cómo utilizar

1. Clonar el repositorio mediante `git clone https://github.com/bredigian/dolar-bna-api.git`.
2. Ingresar al nuevo directorio llamado **dolar-bna-api**.
3. Crear un archivo **.env** con las siguientes variables de entorno:

- URL_TO_SCRAP=url
- DATABASE_URL=mongodb://root:rootpassword@db:27017/
- MONGO_INITDB_ROOT_USERNAME=root
- MONGO_INITDB_ROOT_PASSWORD=rootpassword

4. Ejecutar `docker compose up -d`.
5. Realizar una request de tipo GET con alguna herramienta para API´s como lo son Postman o Bruno con la siguiente URL: http://localhost:4040/?day=[DIA]&month=[MES]&year=[AÑO]
