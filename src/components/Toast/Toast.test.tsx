import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { TouchableWithoutFeedback, Text } from 'react-native';
import MockDate from 'mockdate';
import ToastProvider from '../ToastProvider/ToastProvider';
import { ToastInner } from './Toast';

declare global {
  namespace NodeJS {
    interface Global {
      timeTravel: (n: number) => void;
    }
  }
}

beforeEach(() => {
  // As part of constructing the Animation, it will grab the
  // current time. Mocking the date right away ensures everyone
  // is starting from the same time
  MockDate.set(0);

  // Need to fake the timers for timeTravel to work
  jest.useFakeTimers();
});

const flushPromises = () => new Promise(setImmediate);

describe('<Toast />', () => {
  it('Tests render - non dismissable', async () => {
    const wrapper = mount(
      <ToastProvider position='top'>
        <Text>Child</Text>
      </ToastProvider>,
    );
    await flushPromises();
    wrapper.update();

    // Test render while queue is empty
    expect(wrapper.find(ToastInner)).to.be.empty;
    expect(wrapper.find(ToastInner).props().position).to.equal('top');
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(0);
    expect(wrapper.contains('Child')).to.be.true;

    // Push a toast and update
    wrapper.find(ToastInner).props().push({
      duration: 1,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: false,
    });
    wrapper.update();

    // Test queue length
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(1);

    // Test render of non dismissible
    expect(wrapper.find(TouchableWithoutFeedback)).to.not.have.length;
    expect(wrapper.contains('Toast Text')).to.be.true;
  });

  it('Tests render - dismissable', async () => {
    const wrapper = mount(
      <ToastProvider position='top'>
        <Text>Child</Text>
      </ToastProvider>,
    );
    await flushPromises();
    wrapper.update();

    // Test render while queue is empty
    expect(wrapper.find(ToastInner)).to.be.empty;
    expect(wrapper.find(ToastInner).props().position).to.equal('top');
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(0);
    expect(wrapper.contains('Child')).to.be.true;

    // Push a toast and update
    wrapper.find(ToastInner).props().push({
      duration: 1,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: true,
    });
    wrapper.update();

    // Test queue length
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(1);

    // Test render of non dismissible
    expect(wrapper.find(TouchableWithoutFeedback)).to.not.have;
    expect(wrapper.contains('Toast Text')).to.be.true;
  });

  it('Tests queue', async () => {
    const wrapper = mount(
      <ToastProvider position='top'>
      </ToastProvider>,
    );
    await flushPromises();
    wrapper.update();

    // Push 3 toasts
    wrapper.find(ToastInner).props().push({
      duration: 1,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: false,
    });
    wrapper.find(ToastInner).props().push({
      duration: 1,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: false,
    });
    wrapper.find(ToastInner).props().push({
      duration: 1,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: false,
    });
    wrapper.update();
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(3);


    /**
     * Reduce by 1
     */

    // Simulate layout and update
    wrapper.findWhere((n) => n.props().testID === 'ToastWrap').first().props().onLayout({
      nativeEvent: { layout: { height: 100 } },
    });
    wrapper.update();
    // Wait for the animations to complete and update
    global.timeTravel(5000);
    wrapper.update();

    // Queue should have been reduced
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(2);


    /**
     * Reduce by 1
     */

    // Simulate layout and update
    wrapper.findWhere((n) => n.props().testID === 'ToastWrap').first().props().onLayout({
      nativeEvent: { layout: { height: 100 } },
    });
    wrapper.update();
    // Wait for the animations to complete and update
    global.timeTravel(5000);
    wrapper.update();

    // Queue should have been reduced
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(1);


    /**
     * Reduce by 1
     */

    // Simulate layout and update
    wrapper.findWhere((n) => n.props().testID === 'ToastWrap').first().props().onLayout({
      nativeEvent: { layout: { height: 100 } },
    });
    wrapper.update();
    // Wait for the animations to complete and update
    global.timeTravel(5000);
    wrapper.update();

    // Queue should have been reduced
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(0);
  });

  it('Tests dismissible', async () => {
    const wrapper = mount(
      <ToastProvider position='top'>
      </ToastProvider>,
    );
    await flushPromises();
    wrapper.update();

    // Push a dismissible toast
    wrapper.find(ToastInner).props().push({
      duration: 0,
      component: () => (
        <Text>Toast Text</Text>
      ),
      dismissible: true,
    });
    wrapper.update();

    // Simulate layout and update
    wrapper.findWhere((n) => n.props().testID === 'ToastWrap').first().props().onLayout({
      nativeEvent: { layout: { height: 100 } },
    });
    wrapper.update();

    // Wait for the animations to complete
    global.timeTravel(5000);
    wrapper.update();

    // Try and simulate on press, this should not have any action
    wrapper.find(TouchableWithoutFeedback).props().onPress({} as any);

    // Wait for the animations to complete
    global.timeTravel(5000);
    wrapper.update();

    // Update and test queue
    wrapper.update();
    expect(wrapper.find(ToastInner).props().queue).to.have.lengthOf(0);
  });
});
