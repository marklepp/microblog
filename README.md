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

Set webpack.config.js mode to ```mode: "development",```
on windows powershell run command:
```powershell .\devserver.ps1```

## Running production mode

Set webpack.config.js mode to ```mode: "production",```

run command:

```
npm run build
npm run start
```

Site will open by default to localhost:8080