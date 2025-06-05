import {ImageSourcePropType} from 'react-native';

export interface ActivityType {
  name: string;
  date: string;
  price: string;
  image: ImageSourcePropType;
  cardId: number;
}

export interface DataType {
  cardId: number;
  name: string;
  number: string;
  exp: string;
  cvv: string;
  type: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  activity: ActivityType[];
}

const data: DataType[] = [
  {
    cardId: 1,
    name: 'RBC',
    number: '1234 5678 9101 1121',
    exp: '12/29',
    cvv: '123',
    type: 'mastercard',
    image: require('../assets/Mastercard.png'),
    backgroundColor: '#0059B3',
    activity: [
      {
        name: 'Netflix',
        date: '20 Mins ago',
        price: '-$22.99',
        image: require('../assets/Netflix.png'),
        cardId: 1,
      },
      {
        name: 'Spotify',
        date: '1 Hour ago',
        price: '-$10.99',
        image: require('../assets/Spotify.png'),
        cardId: 1,
      },
      {
        name: 'Apple Music',
        date: '6 Hours ago',
        price: '-$10.99',
        image: require('../assets/AppleMusic.png'),
        cardId: 1,
      },
      {
        name: 'Paypal',
        date: '1 Day ago',
        price: '+$1200',
        image: require('../assets/Paypal.png'),
        cardId: 1,
      },
      {
        name: 'Youtube',
        date: '1 Day ago',
        price: '-$10.99',
        image: require('../assets/Youtube.png'),
        cardId: 1,
      },
      {
        name: 'Apple TV',
        date: '2 Days ago',
        price: '-$50.99',
        image: require('../assets/AppleTV.png'),
        cardId: 1,
      },
      {
        name: 'Steam',
        date: '2 Days ago',
        price: '-$50.99',
        image: require('../assets/Steam.png'),
        cardId: 1,
      },
    ],
  },
  {
    cardId: 2,
    name: 'ScotiaBank',
    number: '1234 5678 9101 1121',
    exp: '12/29',
    cvv: '123',
    type: 'visa',
    image: require('../assets/Visa.png'),
    backgroundColor: '#ff0000',
    activity: [
      {
        name: 'Paypal',
        date: '5 Min ago',
        price: '+$700',
        image: require('../assets/Paypal.png'),
        cardId: 2,
      },
      {
        name: 'Steam',
        date: '40 mins ago',
        price: '-$50.99',
        image: require('../assets/Steam.png'),
        cardId: 2,
      },
    ],
  },
  {
    cardId: 3,
    name: 'Desjardins',
    number: '1234 5678 9101 1121',
    exp: '12/29',
    cvv: '123',
    type: 'visa',
    image: require('../assets/Visa.png'),
    backgroundColor: '#00874E',
    activity: [
      {
        name: 'Apple TV',
        date: '25 Mins ago',
        price: '-$50.99',
        image: require('../assets/AppleTV.png'),
        cardId: 3,
      },
      {
        name: 'Paypal',
        date: '3 Hours ago',
        price: '+$900',
        image: require('../assets/Paypal.png'),
        cardId: 3,
      },
      {
        name: 'Spotify',
        date: '10 Hour ago',
        price: '-$10.99',
        image: require('../assets/Spotify.png'),
        cardId: 3,
      },
    ],
  },
];

export {data};