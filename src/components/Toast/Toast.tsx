import React, { useMemo, useEffect, useState, FC } from 'react';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import styles from './Toast.styles';
import { useToast, ToastContextProps } from '../ToastContext/ToastContext';


/**
 * Toast component listens for changes in the context.queue and renders ToastInner
 */
export const Toast = () => {
  const context = useToast();

  // Wrap ToastInner so it only updates when the queue changes
  return useMemo(() => (
    <ToastInner {...context} />
  ), [context.queue]);
};


/**
 * Toast inner
 * Handles queue and animation
 */
export const ToastInner: FC<ToastContextProps> = (props) => {
  // If there's no queue, then return null here
  if (props.queue.length === 0) return null;


  // Create an animated value only once
  const [bounceValue] = useState(new Animated.Value(0));

  // Required for queuing system
  const [ready, setReady] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  // Required for animation
  const [layout, setLayout] = useState(null);

  // Get the first toast in queue
  const item = props.queue[0];


  /**
   * Removes and destroys first toast in queue
   */
  const removeToast = () => {
    // Clear timeout so the function is not run twice
    clearTimeout(timeoutId);
    setTimeoutId(null);

    // Animate the bounceValue to 1 (hiding toast)
    Animated.spring(
      bounceValue,
      {
        toValue: 0,
        velocity: 3,
        friction: 8,
        useNativeDriver: true,
      },
    ).start(() => {
      /**
       * When finished
       * Destroy the item in the queue
       * Set to ready and clear layout
       */
      props.destroy();
      setLayout(null);
      setReady(true);
    });
  };


  /**
   * Listen for changes in `layout` state
   * At this point we have the information and ready to animate the component into view
   */
  useEffect(() => {
    /**
     * Do nothing if:
     * Not ready (currently animating another toast in the queue)
     * Layout is not set (waiting for component to mount)
     * Qeue length is 0
     */
    if (!ready || layout === null || props.queue.length === 0) return;

    // Set ready to false to block the queue
    setReady(false);

    // Animate the bounceValue to 1 (showing toast)
    Animated.spring(
      bounceValue,
      {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
        useNativeDriver: true,
      },
    ).start(() => {
      if (item.duration > 0) {
        /**
         * When finished at the top, set timeout to `removeToast` using the defined duration
         * Set a timeout, incase the toast is removed before hand, then this can be invalidated
         */
        setTimeoutId(setTimeout(() => {
          removeToast();
        }, item.duration));
      } else {
        /**
         * If duration is set to 0, then do not set timeout
         * However setTimeoutId, otherwise the `onPress` of component will not allow the removal
         */
        setTimeoutId(0);
      }
    });
  }, [layout]);


  /**
   * Gets the output range based on props.position
   * used for interpolating the transform.translateY
   */
  const getOutputRange = () => {
    switch (props.position) {
      case 'bottom':
        return [layout.height, 0];
      case 'top':
        return [layout.height * -1, 0];
      default:
        return [0, 0];
    }
  };


  /**
   * Toast wrap component
   * This must be a function here, so that the component is unmounted every render so that `onLayout` is called
   */
  const ToastWrap = () => (
    <View
      onLayout={(event) => {
        if (!layout) {
          /**
           * When layout is set, we can now animate using these values
           */
          setLayout(event.nativeEvent.layout);
        }
      }}
      testID="ToastWrap"
    >
      {item.dismissible
        ? (
          <TouchableWithoutFeedback
            onPress={() => {
              /**
               * Only let the user dismiss:
               * If the item in the queue is dismissable
               * If the timeoutId is set (only set after fully animated in)
               */
              if (timeoutId != null) {
                removeToast();
              }
            }}
          >
            {item.component(props.safeAreaInsets)}
          </TouchableWithoutFeedback>
        )
        : (
          item.component(props.safeAreaInsets)
        )
      }
    </View>
  );


  /**
   * Safearea view is positioned absolute
   * the position prop will force it to top or bottom
   *
   * Animated view uses the bounceValue (0-1)
   * Animates the opacity, 0 before layout is available
   * Animates transform.translateY when layout is available
   */
  return (
    <View
      style={[
        styles.wrap,
        styles[props.position],
      ]}
    >
      <Animated.View
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            opacity: layout === null ? 0 : bounceValue,
          },
          layout && {
            transform: [{
              translateY: bounceValue.interpolate({
                inputRange: [0, 1],
                outputRange: getOutputRange(),
              }),
            }],
          },
        ]}
      >
        <ToastWrap />
      </Animated.View>
    </View>
  );
};
