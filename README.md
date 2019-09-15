# HLPugs.tf

Source code for the rewrite of the HLPugs.tf site. HLPugs.tf offers Highlander PUGs for the competitive Team Fortress 2 community. This rewrite aims to replace the legacy site with a new platform allowing for customizability in gamemode, match type (PUG or Mix), site layout, colors, and more.

# Getting Started

It's extremely simple to get started. By default you can use a local SQLite DB constucted by TypeORM, and the only thing you will need to set up is a working configuration for Intel.

### Install Dependencies

First install dependencies in the base package.

```bash
npm i
```

After, install dependencies of Intel and Payload.

```bash
npm run install
```

### Configure Intel

For the simplest startup, you can configure the `example-default.json` inside `Intel/`:

1. Copy and rename `example-default.json` to `default.json`
2. Add your own Steam API key to the `app.steam.apiKey` field

After this, your configuration should suffice to get started.

### Run HLPugs.tf

Now that you have everything ready, start the application in the base package.

```bash
npm start
```

The server should start up in development mode with hot reloading/compiling in both Intel and Payload. You may also want to configure the environment variables for Intel in the `Inte/.env` file. Setting NODE_ENV to dev will allow for an interface to show which grants the functionality of simulating logging in and facilitating the events of other fake players
