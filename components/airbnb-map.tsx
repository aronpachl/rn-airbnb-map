import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import debounce from 'lodash.debounce';
import { AnimatePresence } from 'moti';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, Text, TextStyle, View, ViewStyle } from 'react-native';
import MapView from 'react-native-maps';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import ApartmentItem from './apartment-item';
import { Marker } from './marker';
import SelectedApartment from './selected-apartment';
import { Apartment, apartments } from '../assets/data/apartments';
import { shadow } from '../lib/style/global';

export const MIN_BOTTOM_SHEET_HEIGHT = 80;
const INITIAL_CAMERA = {
  center: {
    latitude: 55.686,
    longitude: 12.564,
  },
  pitch: 0,
  heading: 0,
  altitude: 550,
  zoom: 12,
};

export function AirbnbMap() {
  const [selected, setSelected] = React.useState<Apartment | null>(null);
  const snapPoints = useMemo(() => [MIN_BOTTOM_SHEET_HEIGHT, '50%', '90%'], []);
  const screenHeight = useSharedValue(Dimensions.get('window').height);
  const position = useSharedValue(0);
  const mapRef = React.useRef<MapView>(null);
  const [pos, setPos] = React.useState(0);

  const updatePosition = useMemo(() => debounce((pos) => setPos(pos), 16), []);

  const animatedHeight = useDerivedValue(() => {
    const height = screenHeight.value - position.value;

    runOnJS(updatePosition)(position.value);
    return height - 32;
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  useEffect(() => {
    const updateMap = () => {
      if (!mapRef.current || pos === 0) return;
      const windowHeight = Dimensions.get('window').height;

      if (pos >= windowHeight * 0.9 || pos <= windowHeight * 0.4) return;

      mapRef.current.fitToCoordinates(
        apartments.map((apartment) => ({
          latitude: apartment.latitude,
          longitude: apartment.longitude,
        })),
        {
          animated: true,
        }
      );
    };

    const updateMapDebounced = debounce(updateMap, 50);

    updateMapDebounced();

    return () => {
      updateMapDebounced.cancel();
    };
  }, [pos]);

  return (
    <View style={$screen}>
      <View style={$mapWrapper}>
        <MapView ref={mapRef} style={$mapStyle} loadingEnabled initialCamera={INITIAL_CAMERA}>
          {useMemo(() => {
            return apartments.map((apartment) => (
              <Marker
                isSelected={selected?.id === apartment.id}
                apartment={apartment}
                key={apartment.id}
                onPress={() => setSelected(apartment)}
              />
            ));
          }, [selected])}
        </MapView>
        <Animated.View style={[animatedHeightStyle]} />
      </View>
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

const $mapWrapper: ViewStyle = {
  flex: 1,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
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
