import barba from '@barba/core';
import { Application } from '@splinetool/runtime';
import { gsap } from 'gsap';

let spline: Application | null = null;
let obj: any; // You might want to replace 'any' with a more specific type if available
let isToggled: boolean = false;

// Initialize Spline only once
function initSpline(): void {
  if (spline) return; // Check if Spline is already initialized

  const canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
  spline = new Application(canvas);

  spline.load('https://prod.spline.design/14CHZTAPI5leC3Pi/scene.splinecode').then(() => {
    obj = spline.findObjectById('1abf83a1-5d8c-4819-a952-7bcd8afbcb11');
  });
}

// Handle click events using event delegation
function handleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.classList.contains('click-text')) {
    isToggled = !isToggled;
    if (isToggled) {
      spline?.emitEvent('mouseDown', obj.name);
    } else {
      spline?.emitEventReverse('mouseDown', obj.name);
    }
  }
}

// Attach event listener to a static parent element for delegation
const staticParent = document.body; // You can choose any static parent element
staticParent.addEventListener('click', handleClick);

let isTransitioning: boolean = false;

function handleLinkClick(event: Event): void {
  if (isTransitioning) {
    event.preventDefault();
    event.stopPropagation();
  }
}

// Call this function at the start of the transition
function disableNavigation(): void {
  isTransitioning = true;
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', handleLinkClick);
  });
}

// Call this function once the transition is complete
function enableNavigation(): void {
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
      leave(data) {
        // Fade out the current container
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5, // Adjust duration as needed
        });
      },
      enter(data) {
        const nextContainer = data.next.container as HTMLElement;
        nextContainer.classList.add('fixed');

        // Initially set next container to invisible
        gsap.set(nextContainer, { opacity: 0 });

        // Delay the start of the fade-in for the next container
        return gsap.to(nextContainer, {
          opacity: 1,
          duration: 0.5, // Adjust duration as needed
          delay: 0.5, // Delay should match or exceed the leave duration
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
