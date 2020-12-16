$startServer = {
  param($1)
  set-location $1
  npm run server:watch
}
$startWebpack = {
  param($1)
  set-location $1
  npm run webpack:watch
}

$server = start-job -scriptblock $startServer -argumentlist (get-location)
$webpack = start-job -scriptblock $startWebpack -argumentlist (get-location)

while($true) {
  receive-job $webpack;
  receive-job $server;
  sleep -seconds 1;
}