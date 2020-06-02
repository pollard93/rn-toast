/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// setup-tests.js

import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import 'isomorphic-fetch';
import MockAsyncStorage from 'mock-async-storage';

/**
 * Mock Animation setup
 */
// https://stackoverflow.com/questions/42268673/jest-test-animated-view-for-react-native-app
import MockDate from 'mockdate';

// Mocks
const mockImpl = new MockAsyncStorage();
jest.mock('AsyncStorage', () => mockImpl);
jest.mock('NativeAnimatedHelper');
jest.mock('react-native-safe-area', () => ({
  getSafeAreaInsetsForRootView: jest.fn().mockImplementation(() => Promise.resolve(({
    safeAreaInsets: ({ top: 0, bottom: 0, left: 0, right: 0 }),
  }))),
}));

/**
 * Set up DOM in node.js environment for Enzyme to mount to
 */
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

/**
 * Set up Enzyme to mount to DOM, simulate events,
 * and inspect the DOM in tests.
 */
Enzyme.configure({ adapter: new Adapter() });

/**
 * Ignore some expected warnings
 * see: https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 * see https://github.com/Root-App/react-native-mock-render/issues/6
 */
const originalConsoleError = console.error;
console.error = (message) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};

const frameTime = 10;

global.requestAnimationFrame = (cb) => {
  // Default implementation of requestAnimationFrame calls setTimeout(cb, 0),
  // which will result in a cascade of timers - this generally pisses off test runners
  // like Jest who watch the number of timers created and assume an infinite recursion situation
  // if the number gets too large.
  //
  // Setting the timeout simulates a frame every 1/100th of a second
  setTimeout(cb, frameTime);
};

global.timeTravel = (time = frameTime) => {
  const tickTravel = () => {
    // The React Animations module looks at the elapsed time for each frame to calculate its
    // new position
    const now = Date.now();
    MockDate.set(new Date(now + frameTime));

    // Run the timers forward
    jest.advanceTimersByTime(frameTime);
  };

  // Step through each of the frames
  const frames = time / frameTime;
  let framesEllapsed;
  for (framesEllapsed = 0; framesEllapsed < frames; framesEllapsed++) {
    tickTravel();
  }
};
