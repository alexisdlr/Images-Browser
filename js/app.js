if ('serviceWorker' in navigator) {
  // Solicitar permiso de notificaciones
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Permiso de notificación concedido.");

      // Asegurarse de que el Service Worker esté listo
      navigator.serviceWorker.register('/service_worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);

          return navigator.serviceWorker.ready; // Espera hasta que el Service Worker esté activo
        })
        .then(async registration => {
          console.log('Service Worker está listo para manejar notificacione.');

          // Verificar si ya existe una suscripción
          const existingSubscription = await registration.pushManager.getSubscription();
          if (!existingSubscription) {
            console.log("No existe suscripción previa, creando una nueva...");

            // Suscribirse a notificaciones push
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('BEgqRFDruFA8Ie2nfvaaFxfs8fyFAwMPZ6y8TOxStA_r57zvXH782MFGRkhC62eXeSMZiyVjxbzwx1a7nvmvpQ4') // Reemplaza con tu clave pública VAPID
            });

            console.log('Suscripción a Push:', JSON.stringify(subscription));

            // Envía esta suscripción al servidor
            await fetch('http://localhost:8000/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(subscription)
            });
          } else {
            console.log('Ya existe una suscripción activa:', existingSubscription);
          }
        })
        .catch(error => {
          console.error('Error al registrar el Service Worker o Push:', error);
        });
    } else {
      console.warn("Permiso de notificación denegado.");
    }
  }).catch(error => {
    console.error("Error al solicitar permiso de notificaciones:", error);
  });
} else {
  console.warn('Service Workers o PushManager no son soportados por este navegador.');
}

// Convertir clave VAPID a formato Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
