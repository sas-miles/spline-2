import { Application } from '@splinetool/runtime';

let spline, objOne, objTwo;

// Initialize Spline
const canvas = document.getElementById('canvas3d');
spline = new Application(canvas);

// Load Spline scene and find objOne by ID
spline.load('https://prod.spline.design/Xmpmbh3ASnR6RFpl/scene.splinecode').then(() => {
  spline.emitEvent('mouseHover', 'Cube');
});
