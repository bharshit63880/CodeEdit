# Code Edit

A real-time collaborative code editor with file management, syntax highlighting, and integrated chat.

## Features

- Real-time code collaboration using [Socket.IO](https://socket.io/)
- File and folder structure management (create, rename, delete, download)
- Syntax highlighting with [CodeMirror](https://codemirror.net/)
- Multiple themes and font options
- Integrated group chat
- Copilot code generation (AI-powered)
- Download project as ZIP
- Responsive UI with [Tailwind CSS](https://tailwindcss.com/)

## Project Structure

```
client/   # Frontend React app
server/   # Backend Node.js/Express server
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/your-username/code-sync.git
cd code-sync/CodeEdit
```

#### 2. Install dependencies

```sh
cd client
npm install

cd ../server
npm install
```

#### 3. Start the development servers

**Start the backend:**

```sh
cd server
npm run dev
```

**Start the frontend:**

```sh
cd ../client
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- The backend will run on [http://localhost:3000](http://localhost:3000) by default

## Usage

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Create or join a room using a unique Room ID.
- Start collaborating in real-time!

## Scripts

| Directory | Script         | Description                  |
|-----------|---------------|------------------------------|
| client    | `npm run dev` | Start React dev server       |
| client    | `npm run build` | Build frontend for production |
| server    | `npm run dev` | Start backend in dev mode    |
| server    | `npm run build` | Build backend for production  |

## Technologies Used

- React, TypeScript, Vite
- Tailwind CSS
- CodeMirror
- Socket.IO
- Node.js, Express
- JSZip, FileSaver

## License

MIT

---

**Build with ❤️ by [Harshit Bhardwaj](https://github.com/bharshit63880)**
