/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { useToast, ToastProvider } from 'mbp-components-rn-toast';
import { View, Button, Text, SafeAreaView } from 'react-native';

const TestComponent = (props: {position: 'top' | 'bottom'}) => {
  /**
   * Use toast context
   */
  const context = useToast();

  return (
    <View style={{
      justifyContent: 'center',
      flex: 1,
    }}>
      <Button
        title={'Push toast'}
        onPress={() => {
          /**
           * Push toast with context
           */
          context.push({
            duration: 1000,
            component: (
              <View style={{ backgroundColor: 'green' }}>
                {props.position === 'top' && <SafeAreaView />}
                <Text>TOAST {context.queue.length}</Text>
                {props.position === 'bottom' && <SafeAreaView />}
              </View>
            ),
            dismissible: false,
          });
        }}
      />
      <Button
        title={'Push dismissable toast'}
        onPress={() => {
          /**
           * Push toast with context
           */
          context.push({
            duration: 1000,
            component: (
              <View style={{ backgroundColor: 'green' }}>
                {props.position === 'top' && <SafeAreaView />}
                <Text>DISMISSABLE TOAST {context.queue.length}</Text>
                {props.position === 'bottom' && <SafeAreaView />}
              </View>
            ),
            dismissible: true,
          });
        }}
      />
      <Button
        title={'Push only dismissable'}
        onPress={() => {
          /**
           * Push toast with context
           */
          context.push({
            duration: 0,
            component: (
              <View style={{ backgroundColor: 'green' }}>
                {props.position === 'top' && <SafeAreaView />}
                <Text>ONLY DISMISSABLE TOAST {context.queue.length}</Text>
                {props.position === 'bottom' && <SafeAreaView />}
              </View>
            ),
            dismissible: true,
          });
        }}
      />
    </View>
  );
};

storiesOf('Toast', module)
  // .addDecorator((getStory) => <View style={{ backgroundColor: 'red', flex: 1, width: '100%' }}>{getStory()}</View>)
  .add('Toast - bottom', () => (
    <ToastProvider position='bottom'>
      <TestComponent position='bottom' />
    </ToastProvider>
  ))
  .add('Toast - top', () => (
    <ToastProvider position='top'>
      <TestComponent position='top' />
    </ToastProvider>
  ));
