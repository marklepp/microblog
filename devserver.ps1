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

$webpackconfigfile = "./webpack.config.js"
$webpackFileDate = [datetime](Get-ItemProperty -Path $webpackconfigfile -Name LastWriteTime).lastwritetime
while($true) {
  receive-job $webpack;
  receive-job $server;

  $newDate = [datetime](Get-ItemProperty -Path $webpackconfigfile -Name LastWriteTime).lastwritetime;
  if ($webpackFileDate -ne $newDate) {
    stop-job $webpack;
    remove-job $webpack;
    $webpack = start-job -scriptblock $startWebpack -argumentlist (get-location)
  }
  $webpackFileDate = $newDate
  
  start-sleep -seconds 1;
}