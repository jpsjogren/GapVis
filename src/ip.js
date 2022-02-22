const { networkInterfaces } = require('os');

const results = Object.create(null); // Or just '{}', an empty object
  function getIp(){
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results["en0"][0];
}
getIp();
module.exports = results["en0"][0];