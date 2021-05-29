<h1>express-react-app</h1>

You may only need this if:

- you want to build Single Page Application (SPA) in React, with client side rendering solution;
- you want to use Express framework as web server and also for APIs development.

## Requirement

Please make sure your machine has met the following requirements before you start:

| Dependency |   Version   |
| ---------- | :---------: |
| Node       | >= v12.13.0 |
| NPM        | >= v6.12.0  |

## Quick Start

```bash
# cloning git repository into `my-project` folder
git clone --depth=1 https://github.com/borisding/express-react-app.git my-project

# install project dependencies
cd my-project && npm install
```

ii) Running app

For **development**:

```bash
npm run dev
```

> In development mode, APIs are called via configured proxy under webpack's `devServer` option.

For **production**:

Copy `.env.development` to `./config` folder as `.env` for production usage:

```bash
cp config/.env.development config/.env
```

Change environment variables in `.env` to serve your app.

```bash
npm run build && npm start
```

For **test**:

```bash
npm test
```

> Please find out more available scripts in `package.json` file.

**Environment Variables**

`dotenv` and `dotenv-expand` packages are used in conjunction with `webpack.DefinePlugin` plugin for managing environment variables. The entire logic can be found in `./env.config.js` file. The .env file is named and loaded based on the defined `process.env.NODE_ENV` value:

| File name          | NODE_ENV    |    In Source Control    |
| ------------------ | ----------- | :---------------------: |
| `.env.test`        | test        |           Yes           |
| `.env.development` | development |           Yes           |
| `.env`             | production  | No (Need to create new) |

## License

MIT
