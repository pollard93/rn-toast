/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { useToast, ToastProvider } from 'mbp-components-rn-toast';
import { View, Button, Text, SafeAreaView } from 'react-native';


const TestToastComponent = (props: {position: 'top' | 'bottom', content: string}) => {
  /**
   * Get safe area insets
   */
  const { safeAreaInsets } = useToast();

  return (
    <View
      style={[
        { backgroundColor: 'yellow' },
        props.position === 'top' && { paddingTop: safeAreaInsets.top },
        props.position === 'bottom' && { paddingBottom: safeAreaInsets.bottom },
      ]}
    >
      <Text>{props.content}</Text>
    </View>
  );
};


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
              component: (
                <TestToastComponent position={props.position} content={`"TOAST" ${context.queue.length}`} />
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
                <TestToastComponent position={props.position} content={`"DISMISSABLE TOAST" ${context.queue.length}`} />
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
                <TestToastComponent position={props.position} content={`"ONLY DISMISSABLE TOAST" ${context.queue.length}`} />
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
