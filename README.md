# Intel

[![Travis (.com)](https://img.shields.io/travis/com/HLPugs/Intel.svg?style=flat-square)](https://travis-ci.com/HLPugs/Intel)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/HLPugs/Intel.svg?style=flat-square)](https://codeclimate.com/github/HLPugs/Intel)
[![Discord](https://img.shields.io/discord/342788231508787201.svg?style=flat-square)](https://discord.gg/rwXy3rq)
[![GitHub](https://img.shields.io/github/license/HLPugs/Intel.svg?style=flat-square)](LICENSE)

Back end for the Captain Draft & Mix PUG Service under [HLPugs.tf](https://hlpugs.tf). The goal of this project is to create a tool for Captain Draft & Mix PUGs in Team Fortress 2 that is customizable and extendable.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (this comes with Node.js now)
- TypeScript installed: Run `npm i -g typescript` from a command prompt
- [PostgreSQL](https://www.postgresql.org/) v10+ - There are many great tutorials on how to install this on your system of choice
- (Optional) [Payload](https://github.com/HLPugs/Payload) - The accompanying front end to Intel

### Installing
1. Clone the repository
2. Within the repository execute `npm i`
3. Create a new database within PostgreSQL
4. Create a `default.json` within `config/` utilizing `example-default.json` and `default-travis.json` as references
5. Run `npm run build-db` to generate Intel's structure within your new DB

### Developing
1. Run `npm run watch-node` in one terminal
2. In another terminal window run `npm run watch-ts`

These two commands combined will let you develop very quickly. The Node instance will restart every time you change and save a file.

If you do not want the constant building, you can always build manually and run as such:
1. Run `npm run build-ts`
2. Run `npm start`

## Deployment
1. Run `npm run build`
2. Put the built files onto a server and run it using a Node process monitor/manager such as [PM2](http://pm2.keymetrics.io/)

This section is a definite work in progress. Deployment instructions including databases, Payload, NGINX, and more should be better explained in the future.

## Built With
- [Typescript](https://www.typescriptlang.org/) - Type system
- [Express](https://expressjs.com/) - Route handler
- [Socket.io](https://socket.io) - Front end communications

... and much more.

## Authors
- [**Gabe**](https://github.com/GabeKuslansky) - Main Developer
- [**Nicell**](https://github.com/Nicell) - Co-Developer

See the [contributors](https://github.com/HLPugs/Intel/contributors) page for more people who've helped with the project.

## License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE) for details.

## Acknowledgements
- [erynn](https://github.com/erynnb) for helping with technical questions when building the legacy version of HLPugs.tf
