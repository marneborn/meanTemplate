
forever stop fabDev

if (-Not (Test-Path env:NODE_ENV)) {
   $env:NODE_ENV = "development"
}  
if (-Not (Test-Path env:DEBUG)) {
   $env:DEBUG = "*,-send,-connect:dispatcher,-express:router*,-express:application,-body-parser:*"
}
if (-Not (Test-Path env:MONGOPORT)) {
   $env:MONGOPORT = "37017"
}
if (-Not (Test-Path env:PORT)) {
   $env:PORT = "7070"
}

$log = ""+(pwd)+"\logs\forever.log"
$out = ""+(pwd)+"\logs\forever.out"
$err = ""+(pwd)+"\logs\forever.err"
$tag = (Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")

if (Test-Path $log) {
   Rename-Item $log forever.$tag.log
}
if (Test-Path $out) {
   Rename-Item $out forever.$tag.out
}
if (Test-Path $err) {
   Rename-Item $err forever.$tag.err
}  

grunt build:css
forever start --uid fabDev -l $log -o $out -e $err server.js
