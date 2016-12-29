var sys = require('util')
var exec = require('child_process').exec;
var usb = require('usb')

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , conf = require('./config.json');

// Webserver
// auf den Port x schalten
server.listen(conf.port);

app.configure(function () {
  // statische Dateien ausliefern
  app.use(express.static(__dirname + '/public'));
});

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
  // so wird die Datei index.html ausgegeben
  res.sendfile(__dirname + '/public/index.html');
});


const chan = 0;
// Websocket
io.on('connection', function (socket) {
  console.log('Client connected');
  socket.on('fader value', function (fIdent, fVal) {
    console.log('message: ' + fVal + ', ' + fIdent);
    DMXSend(fIdent, fVal);
  });
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');


function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function doRainbow(secs) {
  let keepRainbowing = true;
  setTimeout(() => {
    keepRainbowing = false;
  }, secs * 1000);
  function rainbowLoop() {
    rainbow(() => {
      if (keepRainbowing) {
        rainbowLoop();
      }
    });
  }
  rainbowLoop()
}

function rainbow(cb) {
  fadeTo(0, 0, 255, () => {
    fadeTo(0, 255, 0, () => {
      fadeTo(1, 0, 255, () => {
        fadeTo(1, 255, 0, () => {
          fadeTo(2, 0, 255, () => {
            fadeTo(2, 255, 0, () => {
              if (cb) cb();
            });
          })
        })
      })
    })
  })
}

function fadeTo(channel, from, to, cb) {
  let current = from;
  const intervalId = setInterval(function () {
    if (current !== to) {
      DMXSend(channel, current);
      if (from > to) {
        current--;
      } else {
        current++;
      }
    } else {
      clearInterval(intervalId);
      if (cb) cb()
    }
  }, 1);
}


const device = usb.findByIds(5824, 1500);
if (!device) {
  throw new Error('y u no device')
}

device.open();

const emptyBuff = Buffer.from([]);
function DMXSend(chan, val) {
  const requestType = (usb.LIBUSB_REQUEST_TYPE_VENDOR | usb.LIBUSB_RECIPIENT_DEVICE | usb.LIBUSB_ENDPOINT_OUT);
  device.timeout = 1000;
  device.controlTransfer(requestType, 1, val, chan, emptyBuff, (error, data) => {
    if (error) console.log('ERROR: ' + error);
    if (data) console.log('DATA: ' + data);
  })
}


process.stdin.resume();//so the program will not close instantly

process.on('exit', () => {
  device.close()
});

//catches ctrl+c event// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('Ctrl-C...');
  process.exit(1);
});

//catches uncaught exceptions
process.on('uncaughtException', () => {
  device.close()
});

doRainbow(40)