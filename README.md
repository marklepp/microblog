# microblog

Microblogging site for Web Applications-course

## Installing

Requires npm package manager and node version >= 10

```
git clone https://github.com/marklepp/microblog.git
cd microblog
npm install
```

## Running development server

Set webpack.config.js mode to ```mode: "development"```

on windows powershell run command:

```powershell .\devserver.ps1```

on linux, bash (webpack needs to be restarted if webpack.config.js is modified):

```
npm run webpack:watch & npm run server:watch
```

## Running production mode

Set webpack.config.js mode to ```mode: "production"```

run command:

```
npm run build
npm run start
```

Site will open by default to localhost:8080