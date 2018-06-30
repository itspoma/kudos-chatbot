## Setup at production

- Setup Node.js v8 via [nvm](https://github.com/creationix/nvm).

### Setup Bot at production

- `$ cd bot/`
- `$ npm install`.
- `$ npm install -g pm2`.
- `$ pm2 start npm -- start`.

### Setup Admin at production

- `$ cd admin/`
- `$ npm install`.
- `$ npm install strapi@alpha -g`.
- `$ pm2 start strapi -- start`.

- `$ strapi start`.