import { ViewStyle } from 'react-native';

export const shadow: { [key: string]: ViewStyle } = {
  xs: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,

    elevation: 7,
  },
};
