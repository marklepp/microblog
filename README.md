# microblog

Microblogging site for Web Applications-course

## Installing

Requires npm package manager.

```
git clone https://github.com/marklepp/microblog.git
cd microblog
npm install
```

## Running development server

Set webpack.config.js mode to ```mode: "development"```

on windows powershell run command:

```powershell .\devserver.ps1```

on linux, bash:

```
npm run webpack:watch &
P1=$!
npm run server:watch &
P2=$!
wait $P1 $P2
```

## Running production mode

Set webpack.config.js mode to ```mode: "production"```

run command:

```
npm run build
npm run start
```

Site will open by default to localhost:8080