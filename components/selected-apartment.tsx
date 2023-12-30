import { MotiView } from 'moti';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';

import ApartmentItem from './apartment-item';
import { Apartment } from '../assets/data/apartments';
import { shadow } from '../lib/style/global';

type Props = {
  apartment: Apartment;
  onClose: () => void;
};

export function SelectedApartment({ apartment, onClose }: Props) {
  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: 200,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      exit={{
        opacity: 0,
        translateY: 200,
      }}
      transition={{
        type: 'timing',
        easing: Easing.out(Easing.exp),
        duration: 250,
      }}
      exitTransition={{
        type: 'timing',
        easing: Easing.in(Easing.ease),
        duration: 800,
      }}
      style={$selectedItemContainer}>
      <TouchableOpacity onPress={onClose} style={$closeCircle}>
        <Text style={$closeIcon}>X</Text>
      </TouchableOpacity>
      <ApartmentItem apartment={apartment} />
    </MotiView>
  );
}

const $selectedItemContainer: ViewStyle = {
  backgroundColor: '#fff',
  position: 'absolute',
  bottom: 96,
  left: 16,
  right: 16,
  ...shadow.lg,
  borderRadius: 8,
};

const $closeCircle: ViewStyle = {
  zIndex: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: '#00000050',
  borderRadius: 50,
  padding: 8,
  width: 30,
  height: 30,
  ...shadow.sm,
};

const $closeIcon: TextStyle = {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#fff',
};

export default SelectedApartment;
