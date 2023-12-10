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

    // Get list of Spline events used in the scene
    const splineEvents = spline.getSplineEvents();
    console.log('Spline Events:', splineEvents);

    const objOne = spline.findObjectById('1abf83a1-5d8c-4819-a952-7bcd8afbcb11');
    console.log('Object one found:', objOne);

    // Add click event listener for objOne
    document.querySelectorAll('.trigger_objone').forEach((element) => {
      console.log('Listener added to:', element);
      element.addEventListener('click', () => {
        console.log('Clicked:', objOne);
        if (objOne) {
          spline.emitEvent('mouseDown', objOne.id);
          console.log('Event emitted for objOne');
        }
      });
    });
  })
  .catch((error) => {
    console.error('Error loading Spline scene:', error);
  });
