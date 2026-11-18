// Lưu sẵn app để mở được cả khi không có mạng. Đổi số phiên bản mỗi lần cập nhật.
const CACHE='tu-do-v6';
const FILES=['./','index.html','trends.json','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  // Trang chính: lấy bản mới khi có mạng, không có mạng thì dùng bản đã lưu
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./',c));return r}).catch(()=>caches.match('./')));return}
  if(new URL(req.url).pathname.endsWith('trends.json')){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));return r}).catch(()=>caches.match(req,{ignoreSearch:true})));return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok&&new URL(req.url).origin===location.origin){const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c))}return r}).catch(()=>hit)));
});
