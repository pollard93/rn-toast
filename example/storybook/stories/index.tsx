/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { useToast, ToastProvider } from 'mbp-components-rn-toast';
import { View, Button, Text } from 'react-native';

const TestComponent = () => {
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
              <View style={{ backgroundColor: 'green', height: 50 }}>
                <Text>TOAST {context.queue.length}</Text>
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
              <View style={{ backgroundColor: 'green', height: 50 }}>
                <Text>DISMISSABLE TOAST {context.queue.length}</Text>
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
              <View style={{ backgroundColor: 'green', height: 50 }}>
                <Text>ONLY DISMISSABLE TOAST {context.queue.length}</Text>
              </View>
            ),
            dismissible: true,
          });
        }}
      />
    </View>
  );
};

storiesOf('Hello', module)
  .add('Toast - bottom', () => (
    <ToastProvider position='bottom'>
      <View style={{
        flex: 1,
        width: '100%',
      }}>
        <TestComponent />
      </View>
    </ToastProvider>
  ))
  .add('Toast - top', () => (
    <ToastProvider position='top'>
      <View style={{
        flex: 1,
        width: '100%',
      }}>
        <TestComponent />
      </View>
    </ToastProvider>
  ));
