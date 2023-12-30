import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AirbnbMap } from './components/airbnb-map';

export default function App() {
  return (
    <GestureHandlerRootView>
      <AirbnbMap />
    </GestureHandlerRootView>
  );
}
