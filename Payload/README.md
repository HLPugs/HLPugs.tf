# Payload

[![Code Climate](https://img.shields.io/codeclimate/maintainability/HLPugs/Payload.svg?style=flat-square)](https://codeclimate.com/github/HLPugs/Payload)
[![Discord](https://img.shields.io/discord/342788231508787201.svg?style=flat-square)](https://discord.gg/rwXy3rq)
[![GitHub](https://img.shields.io/github/license/HLPugs/Payload.svg?style=flat-square)](LICENSE)


Front end for the Captain Draft & Mix PUG Service under [HLPugs.tf](https://hlpugs.tf). The goal of this project is to create a tool for Captain Draft & Mix PUGs in Team Fortress 2 that is customizable and extendable.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (this comes with Node.js now)
- TypeScript installed: Run `npm i -g typescript` from a command prompt
- [Intel](https://github.com/HLPugs/Intel) - The accompanying back end to Payload

### Installing
1. Clone the repository
2. Within the repository execute `npm i`

### Developing
1. Start your Intel instance
2. Run `npm start` inside of Payload

Now you should be able to start editing any `.tsx` or `.ts` file and get instant feedback through `localhost:3000`

### Customizing
If you are just interested in customizing your own instance of Payload, here are a few simple things you can do.

1. Edit `/src/style.scss`'s variables to get colors and other simple visuals changed
2. Edit `/public` files to your liking. This includes `favicon.ico`, `index.html`, and `manifest.json`
3. Replace `/src/img/logo.svg` with your respective logo

## Deployment
After customizing/developing your changes, you can deploy Payload to a static webhost.

1. Run `npm run build` to create the static files necessary
2. Add these files to your static host such as [NGINX](https://www.nginx.com/)

## Built With
- [React](https://reactjs.org) ([React TS Scripts](https://github.com/wmonk/create-react-app-typescript)) - User interface library
- [Typescript](https://www.typescriptlang.org/) - Type system
- [Socket.io](https://socket.io) - Back end communications
- [Emoji Mart](https://github.com/missive/emoji-mart) - Emoji picker

## Authors
- [**Nicell**](https://github.com/nicell) - Main Developer and Designer
- [**Kala**](https://github.com/kalasalad) - UI/UX Contributor

See the [contributors](https://github.com/HLPugs/Payload/contributors) page for more people who've helped with the project.

## License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE) for details.

## Acknowledgements
- Sickday and Qixalite for the [TF2 Class Icons](https://github.com/Qixalite/tf2-classfont)
- [erynn](https://github.com/erynnb) for helping with technical questions when building the legacy version of HLPugs.tf
