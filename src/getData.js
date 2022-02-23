const ZwiftPacketMonitor = require('@zwfthcks/zwift-packet-monitor')
const http = require('http');
var ip = require('ip');
const monitor = new ZwiftPacketMonitor(ip.address())

//Display local IP
console.log();
console.log("Your local IP: " + ip.address());
console.log();
// Welcome message & "instuctions"
console.log("GapVis Backend is running, quit with Ctrl + C");

let data = []
let bunches = []
let distBetweenBunches = 10 // 7 meter


monitor.on('incomingPlayerState', (playerState, serverWorldTime) => {
  addValues(playerState);
  getData();
})

const start = monitor.start()


// Reset the player stats every 30 sec. Good for when changing events or similar. 
setInterval( function  () {
  data = [];
},30000);

function addValues(playerState){
  let obj = data.find((o, i) => {
    if (o.id === playerState.id) {
        data[i] = {
                    id: playerState.id,
                    speed: (Math.round((playerState.speed / 1000000) * 100) / 100),
                    distance: (Math.round((playerState.f34 / 100000) * 1000) / 1000),
                  }
        return true; // stop searching
    }
});
  if (obj == null){
    data.push(
      {
        id: playerState.id,
        speed: (Math.round((playerState.speed / 1000000) * 100) / 100),
        distance:(Math.round((playerState.f34 / 100000) * 1000) / 1000),
      }
    );
  }
}

function getData(){
  sortData();
}

function sortData(){
  data.sort(function(a, b) {
    return parseFloat(b.distance) - parseFloat(a.distance);
  });
}

function createBunches(){
  bunches = []
  var len = data.length
  let ids=[]
  let speed = 0
  let distance = 0
  let gap = 0

  for (i = 0; i < len; i++){
    if (i == 0){
      ids.push(data[i].id)
      speed = data[i].speed
      distance = data[i].distance
    }
    if (!(Math.round(data[i].distance*1000) - (Math.round(data[i+1].distance*1000)) > distBetweenBunches)){
      ids.push(data[i].id)
      speed = data[i].speed
      distance = data[i].distance
      //gap = 
    }
    else {
      bunches.push({
        size: ids.length,
        speed: speed,
        distance: distance,
        gap: Math.round(data[i].distance*1000) - (Math.round(data[i+1].distance*1000)),
        ids: ids
      })
    
      ids = []
      gap = 0
      ids.push(data[i+1].id)
      speed = data[i+1].speed
      distance = data[i+1].distance
    }

    // Make sure not to arrayOutOfRange
    if ((i+2) == len){
      break;
    }
  }
  //console.log(bunches);
  return bunches;
}

const requestListener = function (req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000,
    'Content-Type': 'application/json',
  };

  switch(req.url){
    case "/":
      res.writeHead(200, headers);
      res.write(JSON.stringify(createBunches()));
      res.end();
      break;
    case "/ttt":
      res.writeHead(200, headers);
      res.write(JSON.stringify(data));
      res.end();
      break;
  }
}

const server = http.createServer(requestListener);
server.listen(8080);
