
forever stop fab

# Always use this in production...
$env:DEBUG = "thinfilm-fab:*,-*:debug"
$env:NODE_ENV = "production"

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

# build:dist is in master branch
forever start --uid fab -l $log -o $out -e $err server.js
