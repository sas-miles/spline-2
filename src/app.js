import { Application } from '@splinetool/runtime';

// Initialize Spline
const canvas = document.getElementById('canvas3d');
const spline = new Application(canvas);
console.log('Spline initialized');

// Load Spline scene and find object by ID
spline
  .load('https://prod.spline.design/Xmpmbh3ASnR6RFpl/scene.splinecode')
  .then(() => {
    console.log('Spline scene loaded');

    const objOne = spline.findObjectById('1abf83a1-5d8c-4819-a952-7bcd8afbcb11');
    console.log('Object one found:', objOne);

    // Event delegation: Set up click event listener on the document body
    document.body.addEventListener('click', (event) => {
      // Check if the clicked element has the class 'trigger_objone'
      if (event.target.classList.contains('trigger_objone')) {
        console.log('Clicked:', objOne);
        if (objOne) {
          spline.emitEvent('mouseDown', objOne.id);
          console.log('Event emitted for objOne');
        }
      }
    });
  })
  .catch((error) => {
    console.error('Error loading Spline scene:', error);
  });
