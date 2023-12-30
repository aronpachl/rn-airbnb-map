import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { MapMarker, Marker as RNMapsMarker } from 'react-native-maps';

import { Apartment } from '../assets/data/apartments';
import { shadow } from '../lib/style/global';

type Props = {
  isSelected?: boolean;
  apartment: Apartment;
};

type RNMapMarkerProps = Omit<React.ComponentPropsWithRef<typeof RNMapsMarker>, 'coordinate'>;

export const Marker = React.forwardRef<MapMarker, RNMapMarkerProps & Props>(
  ({ apartment, isSelected, ...props }, ref) => {
    return (
      <RNMapsMarker
        key={apartment.id}
        ref={ref}
        coordinate={{
          latitude: apartment.latitude,
          longitude: apartment.longitude,
        }}
        {...props}>
        <View style={[$marker, isSelected && $selectedMarker]}>
          <Text style={[$markerText, isSelected && $selectedMarkerText]}>${apartment.price}</Text>
        </View>
      </RNMapsMarker>
    );
  }
);

const $marker: ViewStyle = {
  backgroundColor: '#fff',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 50,
  borderWidth: 1,
  borderColor: '#00000050',
  ...shadow.xs,
};

const $selectedMarker: ViewStyle = {
  backgroundColor: '#000000',
};

const $markerText: TextStyle = {
  fontSize: 16,
  fontWeight: 'bold',
};

const $selectedMarkerText: TextStyle = {
  color: '#fff',
};
