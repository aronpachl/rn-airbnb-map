import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import debounce from 'lodash.debounce';
import { AnimatePresence } from 'moti';
import React, { useMemo } from 'react';
import { Dimensions, Text, TextStyle, View, ViewStyle } from 'react-native';
import MapView from 'react-native-maps';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import ApartmentItem from './apartment-item';
import { Marker } from './marker';
import SelectedApartment from './selected-apartment';
import { Apartment, apartments } from '../assets/data/apartments';
import { shadow } from '../lib/style/global';

export const MIN_BOTTOM_SHEET_HEIGHT = 80;
const INITIAL_CAMERA = {
  center: {
    latitude: 55.696089943389744,
    longitude: 12.572405340241287,
  },
  pitch: 0,
  heading: 0,
  altitude: 27507,
  zoom: 12,
};

export function AirbnbMap() {
  const [selected, setSelected] = React.useState<Apartment | null>(null);
  const snapPoints = useMemo(() => [MIN_BOTTOM_SHEET_HEIGHT, '50%', '90%'], []);
  const position = useSharedValue(0);
  const mapRef = React.useRef<MapView>(null);

  const updateCameraAltitude = useMemo(
    () =>
      debounce((pos) => {
        if (!mapRef.current) return;

        const windowHeight = Dimensions.get('window').height;
        if (pos < windowHeight * 0.4) return;

        if (pos > windowHeight * 0.8) {
          mapRef.current.animateCamera(INITIAL_CAMERA, {
            duration: 100,
          });
          return;
        }

        const currentActualPositionFromBottom = windowHeight - pos;
        const altitude = Math.round(currentActualPositionFromBottom) * 10;
        const multiplier = Math.round(altitude / 1000) * 3000;
        const extraAltitude = altitude + multiplier;

        mapRef.current.animateCamera(
          {
            ...INITIAL_CAMERA,
            center: {
              ...INITIAL_CAMERA.center,
              // latitude: INITIAL_CAMERA.center.latitude + pos * 0.0001,
            },
            altitude: INITIAL_CAMERA.altitude + extraAltitude,
          },
          {
            duration: 100,
          }
        );
      }, 16),
    []
  );

  useAnimatedReaction(
    () => position.value,
    (prepareResult) => {
      runOnJS(updateCameraAltitude)(prepareResult);
    }
  );

  return (
    <View style={$screen}>
      <MapView ref={mapRef} style={$mapStyle} loadingEnabled initialCamera={INITIAL_CAMERA}>
        {apartments.map((apartment) => (
          <Marker
            isSelected={selected?.id === apartment.id}
            apartment={apartment}
            key={apartment.id}
            onPress={() => setSelected(apartment)}
          />
        ))}
      </MapView>
      <AnimatePresence>
        {selected && <SelectedApartment apartment={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      <BottomSheet
        snapPoints={snapPoints}
        animatedPosition={position}
        index={0}
        backgroundStyle={{
          borderRadius: 32,
          ...shadow.lg,
        }}>
        <BottomSheetFlatList
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: 16,
          }}
          ListHeaderComponent={() => (
            <View>
              <Text style={$selectedItemTitle}>Over {apartments.length} places</Text>
            </View>
          )}
          initialNumToRender={10}
          keyExtractor={(item) => item.id}
          data={apartments}
          renderItem={({ item }) => (
            <View style={selected?.id === item.id && $selectedApartment}>
              <ApartmentItem apartment={item} />
            </View>
          )}
        />
      </BottomSheet>
    </View>
  );
}

const $screen: ViewStyle = {
  height: '100%',
  width: '100%',
};

const $selectedItemTitle: TextStyle = {
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 16,
};

const $mapStyle: ViewStyle = {
  flex: 1,
};

const $selectedApartment: ViewStyle = {
  backgroundColor: '#1f1f1f20',
  borderRadius: 8,
};
