import barba from '@barba/core';
import { Application } from '@splinetool/runtime';
import { gsap } from 'gsap';

let spline = null;
let obj = null;
let isToggled = false;

// Initialize Spline only once
function initSpline() {
  if (spline) return; // Check if Spline is already initialized

  const canvas = document.getElementById('canvas3d');
  spline = new Application(canvas);

  spline.load('https://prod.spline.design/14CHZTAPI5leC3Pi/scene.splinecode').then(() => {
    obj = spline.findObjectById('1abf83a1-5d8c-4819-a952-7bcd8afbcb11');
  });
}

// Handle click events using event delegation
function handleClick(event) {
  const { target } = event;
  if (target.classList.contains('click-text')) {
    isToggled = !isToggled;
    if (isToggled) {
      if (spline) spline.emitEvent('mouseDown', obj.name);
    } else {
      if (spline) spline.emitEventReverse('mouseDown', obj.name);
    }
  }
}

// Attach event listener to a static parent element for delegation
const staticParent = document.body;
staticParent.addEventListener('click', handleClick);

let isTransitioning = false;

function handleLinkClick(event) {
  if (isTransitioning) {
    event.preventDefault();
    event.stopPropagation();
  }
}

// Call this function at the start of the transition
function disableNavigation() {
  isTransitioning = true;
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', handleLinkClick);
  });
}

// Call this function once the transition is complete
function enableNavigation() {
  isTransitioning = false;
  document.querySelectorAll('a').forEach((link) => {
    link.removeEventListener('click', handleLinkClick);
  });
}

barba.init({
  transitions: [
    {
      name: 'default-transition',
      preventRunning: true,
      beforeEnter() {
        disableNavigation(); // Disable navigation at the start of the transition
      },
      enter(data) {
        const nextContainer = data.next.container;
        nextContainer.classList.add('fixed');

        gsap.to(data.current.container, {
          opacity: 0,
          duration: 2,
        });
        // Delay the start of the fade-in for the next container
        return gsap.to(nextContainer, {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          onComplete: () => {
            nextContainer.classList.remove('fixed');
            enableNavigation(); // Re-enable navigation after the transition
          },
        });
      },
    },
  ],
});

initSpline();
