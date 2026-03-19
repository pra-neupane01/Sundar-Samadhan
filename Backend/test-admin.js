const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 4849,
  path: '/api/v1/admin/stats',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Stats Response:', data));
});
req.on('error', console.error);
req.end();

const req2 = http.request({
  hostname: 'localhost',
  port: 4849,
  path: '/api/v1/admin/all-users',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Users Response:', data));
});
req2.on('error', console.error);
req2.end();

const req3 = http.request({
  hostname: 'localhost',
  port: 4849,
  path: '/api/v1/admin/all-donations',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Donations Response:', data));
});
req3.on('error', console.error);
req3.end();
