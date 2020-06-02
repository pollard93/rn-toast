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
    <SafeAreaView
      style={{
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'red',
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'green',
        }}
      >
        <Button
          title={'Push toast'}
          onPress={() => {
            /**
             * Push toast with context
             */
            context.push({
              duration: 1000,
              component: (safeAreaInsets) => (
                <View
                  style={[
                    { backgroundColor: 'yellow' },
                    props.position === 'top' && { paddingTop: safeAreaInsets.top },
                    props.position === 'bottom' && { paddingBottom: safeAreaInsets.bottom },
                  ]}
                >
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
              component: (safeAreaInsets) => (
                <View
                  style={[
                    { backgroundColor: 'yellow' },
                    props.position === 'top' && { paddingTop: safeAreaInsets.top },
                    props.position === 'bottom' && { paddingBottom: safeAreaInsets.bottom },
                  ]}
                >
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
              component: (safeAreaInsets) => (
                <View
                  style={[
                    { backgroundColor: 'yellow' },
                    props.position === 'top' && { paddingTop: safeAreaInsets.top },
                    props.position === 'bottom' && { paddingBottom: safeAreaInsets.bottom },
                  ]}
                >
                  <Text>ONLY DISMISSABLE TOAST {context.queue.length}</Text>
                </View>
              ),
              dismissible: true,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

storiesOf('Toast', module)
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
