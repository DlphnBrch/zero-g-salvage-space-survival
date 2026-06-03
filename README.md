# Zero-G Salvage: Space Survival

A small zero-gravity survival prototype set in space. You drift around, collect supplies, and try to keep hunger, thirst, oxygen, and extinguisher fuel under control. Supplies can be consumed right away or brought back to the storage zone for score.

Built with Three.js, cannon-es, and Vite.

## Running

Make sure Node.js is installed, then install the project dependencies:

```bash
npm install
```

This reads `package.json` and downloads the libraries the project needs, including Three.js, cannon-es, lil-gui, and Vite. It also creates or updates the `node_modules` folder. You normally only need to run this once after cloning the project, or again if the dependencies change.

If you are setting up a similar project from scratch, these are the package install commands:

```bash
npm install three cannon-es lil-gui
```

```bash
npm install -D vite
```

In this repository, those packages are already listed in `package.json`, so `npm install` is enough.

Start the dev server:

```bash
npm run dev
```

Open the localhost URL printed by Vite.

## Controls

- Mouse: look around
- Click: lock the mouse
- W/A/S/D: forward, backward, and side thrust
- X / Z: thrust up and down
- Alt: boost
- Space or left click: push backward with the extinguisher
- E: grab a nearby item or drop the held item
- Hold and release left click: throw the held item
- C: consume the held supply
- F: flashlight
- R: scanner ping
- G: settings panel
- Esc: pause


