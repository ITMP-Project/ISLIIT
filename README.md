# ISLIIT

This repo is split into two parts:

- `client/` - Vue + Vite frontend
- `server/` - Node + MongoDB API

#### Preview
 - [Demo]()


## Client (Vue)

```bash
cd client
npm install
npm run dev
```

## Server (Mongo API)

```bash
cd server
npm install
npm run start
```

## Environment Variables

Server (file: `server/.env`):

```bash
MONGO_URI=mongodb+srv://anuk:YOUR_PASSWORD@cluster0.ty5uvvn.mongodb.net/?appName=Cluster0
DB_NAME=sample_mflix
PORT=4000
```

Client (file: `client/.env`):

```bash
VITE_API_URL=http://localhost:4000
```

