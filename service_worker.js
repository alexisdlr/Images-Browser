const CACHE_NAME = 'buscador-imagenes-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/custom.css', // Cambia por el nombre de tu archivo CSS
  '/js/app.js',     // Cambia por el nombre de tu archivo JS
  '/manifest.json',
  '/icons/icon.png',
];

// Instalar el service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar el service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      // Convierte los datos recibidos en un objeto JSON
      const data = event.data.json();

      console.log(data, 'notificacion')

      // Muestra la notificación
      event.waitUntil(
        self.registration.showNotification(data.title || 'titulo', {
          body: data.body || 'No hay',
          icon: data.icon || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy_EXtATKPKHh9NQshUwkh-cm0WVBl5sI5dA&s', // Usa un icono predeterminado si no se proporciona
        })
        
      );
    } catch (error) {
      console.error('Error procesando los datos de la notificación:', error);
    }
  } else {
    console.warn('No se recibieron datos en el evento push.');
  }
});



// Manejar clic en la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Cierra la notificación

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        // Si hay pestañas abiertas de la app, enfócalas
        return clientList[0].focus();
      }
      // Si no hay pestañas abiertas, abre una nueva
      return clients.openWindow('/');
    })
  );
});
