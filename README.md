# Mini clubhouse backend
The project allows you to register via github,
upload an avatar,
log in via activation by code for a test,
use 1234,
create rooms,
join a room via webrtc and sockets

The package [simple-peer](https://github.com/feross/simple-peer) is used for webrtc.
The implementation of the signaling server is done with [socket.io](https://socket.io/)

## Configuration
Add config file ( .env file )
```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

DB_USER=
DB_PORT=
DB_PASSWORD=
DB_HOST=
DB_NAME=

FRONTEND_URL=
API_URL=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=

SECRET_KEY_JWT=
MAX_AGE_JWT=
```

## Migration
Create migration
```
npx sequelize-cli migration:generate --name <name-migration>
```
Roll migration
```
npx sequelize-cli db:migrate
```
Undo migration
```
npx sequelize-cli db:migrate:undo --name <name-migration>
```
## Running
```
yarn install
```
then `yarn dev` or `yarn prod` in the main directory.

Then open the browser at `localhost:3001`.

## Swagger
```
http://localhost:3001/api-docs/swagger/#/
```
