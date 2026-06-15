// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";

// Suppress RTL v13 / React 18 act() deprecation noise — fixed in RTL v14 which
// CRA (react-scripts 5) cannot use. This warning comes from @testing-library
// internals, not from our code, so it is safe to silence globally.
const originalError = console.error.bind(console);
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("ReactDOMTestUtils.act"))
    return;
  originalError(...args);
};

// Mock browser APIs not available in jsdom
Object.defineProperty(window, "speechSynthesis", {
  writable: true,
  configurable: true,
  value: {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [],
    speaking: false,
    pending: false,
    paused: false,
  },
});

// Mock navigator.mediaDevices
Object.defineProperty(navigator, "mediaDevices", {
  writable: true,
  configurable: true,
  value: {
    getUserMedia: () => Promise.resolve({ getTracks: () => [] }),
    enumerateDevices: () => Promise.resolve([]),
  },
});

// Mock canvas context
HTMLCanvasElement.prototype.getContext = function () {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [], width: 0, height: 0 }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
    canvas: this,
  };
};
