$startServer = {
  param($1)
  set-location $1
  npm run start
}

npm run build
$serverProcess = start-job -ScriptBlock $startServer -ArgumentList (get-location)

$firstrun = $true
$writetimes = @{}

while ($true) {
  $dirs = [string[]] @(".\*"; (Get-ChildItem * -Recurse -Directory | 
    where-object { $_.FullName -notmatch "node_modules|dist"}| ForEach-Object{$_.FullName + "\*"}))

  $files = [string[]] (Get-ChildItem -Path $dirs -Include *.js, *.html, *.css).FullName

  if ($firstrun){
    foreach ($file in $files) {
      $writetimes.Set_item($file, [datetime](Get-ItemProperty -Path $file -Name LastWriteTime).lastwritetime)
    }
    $firstrun = $false
  }

  $changedFiles = @();
  foreach($file in $files) {
    $newTime = [datetime](Get-ItemProperty -Path $file -Name LastWriteTime).lastwritetime

    if ($writetimes.ContainsKey($file)) {
      if ($writetimes[$file] -ne $newTime) {
        $changedFiles += $file
        "File: " + $file + " changed!"
      }
    } else {
      $changedFiles += $file
      
      "New file: " + $file
    }
    
    $writetimes.Set_item($file, $newTime)
  }

  if ($changedFiles.count -ne 0) {
    #Stop-job $serverProcess
    #remove-job $serverProcess
    foreach ($file in $changedFiles) {
      if ($file -match "public") {
        "File: " + $file
        npm run build
        break
      }
    }
    #$serverProcess = start-job -ScriptBlock $startServer -ArgumentList (get-location)
  }

  Start-Sleep -Seconds 1
}
