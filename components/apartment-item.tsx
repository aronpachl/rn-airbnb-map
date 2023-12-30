import React from 'react';
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native';

import type { Apartment } from '../assets/data/apartments';

type Props = {
  apartment: Apartment;
};

function ApartmentItem({ apartment }: Props) {
  return (
    <View style={$contentWrapper}>
      <Image
        style={$coverImage}
        source={{
          uri: apartment.imageUrl,
        }}
      />
      <View style={$infoWrapper}>
        <Text allowFontScaling={false} style={$title}>
          {apartment.title}
        </Text>
        <Text maxFontSizeMultiplier={1.2} style={$description} numberOfLines={2}>
          {apartment.description}
        </Text>
        <View style={$priceAndRatingWrapper}>
          <Text>
            <Text maxFontSizeMultiplier={1} style={$price}>
              ${apartment.price}
            </Text>{' '}
            total
          </Text>
          <Text>
            ★ {apartment.rating.toFixed(1)} ({apartment.numberOfRatings})
          </Text>
        </View>
      </View>
    </View>
  );
}

const $contentWrapper: ViewStyle = {
  overflow: 'hidden',
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
};

const $coverImage: ImageStyle = {
  width: 150,
  aspectRatio: 1,
};

const $infoWrapper: ViewStyle = {
  padding: 8,
  flex: 1,
};

const $title: TextStyle = {
  fontSize: 20,
  fontWeight: '500',
};

const $description: TextStyle = {
  fontSize: 14,
  color: '#00000080',
  marginTop: 4,
};

const $priceAndRatingWrapper: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: 'auto',
};

const $price: TextStyle = {
  fontSize: 18,
  fontWeight: '500',
};

export default ApartmentItem;
