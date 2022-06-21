## Getting Started

### Pre-requisites

- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)
- Node.js v16.14.2
- Java (required by the Firestore emulator)

This project uses Firestore and Auth emulators, so you need to have them running.

```bash
npm run emulators
```

Emulator dashboard will be available at [http://localhost:4000](http://localhost:4000), there will be data loaded from the `.firebase-emulators` folder, feel free to edit the data through the dashboard UI, it won't get saved permanently unless you start the emulators as following.

```bash
npm run emulators:export-on-exit
```

Then, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
