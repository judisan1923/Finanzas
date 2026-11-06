var CACHE='finanzas-v1';
var CDN=['https://cdn.tailwindcss.com/3.4.17','https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    var jobs=['./','./index.html'].map(function(u){return c.add(u).catch(function(){})});
    CDN.forEach(function(u){jobs.push(fetch(new Request(u,{mode:'no-cors'})).then(function(r){return c.put(u,r)}).catch(function(){}))});
    return Promise.all(jobs);
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(r){
      if(r&&(r.ok||r.type==='opaque')){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp)})}
      return r;
    }).catch(function(){return hit||(e.request.mode==='navigate'?caches.match('./index.html'):undefined)});
    return hit||net;
  }));
});
