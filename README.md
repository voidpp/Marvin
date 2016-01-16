# Marvin
Displays various information about current playing content in xbmc/kodi, chromecast, etc.

Designed for 7-8" tablet with average resolution

## Example screenshot
![marvin](http://p.coldline.hu/2016/01/11/2094069-20160111-FD4shf.png)

## Install
At this time, install possible only from source:
```
git clone https://github.com/voidpp/Marvin.git
cd Marvin
npm install
cp config_example.js config.js
# edit config.js ... or assets/scss/main.scss for device width/height
grunt build
grunt install --target=/a/wwwroot/folder
```
Install sg webserver, configure the /a/wwwroot/folder as wwwroot.

(After every config modification need to rerun the build+install commands!)

## External dependencies
(optional) For Chromecast use the PyCCWS https://github.com/voidpp/pyccws 
