import { Meteor } from 'meteor/meteor'

Meteor.startup(() => {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.info('service worker registered'))
    .catch(error => {
      console.log('serviceWorker registration failed: ', error)
    })
})

let isApple = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
if(isApple && !isInStandaloneMode && localStorage.getItem("seen") === null) {
}
//alert(isApple);

// window.addEventListener('load', (event) => {
//   if (screen.width > 1279) {
//     buttonInstall.style.display = "block";
//   } else {
//     buttonInstall.style.display = "none";
//   }
//   console.log('page is fully loaded');
// });

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // console.log(`'beforeinstallprompt' event was fired.`);
  if ((window.location.pathname == "/") && (window.location.pathname != '/vs1greentracklogin')) {
    let buttonInstall = document.querySelector("#erplogin-button");
    buttonInstall.addEventListener('click', async (e) => {
      e.preventDefault();
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      // Optionally, send analytics event with outcome of user choice
      // console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
    });
}
});
