
import {Platform} from 'react-native';

// Address to stripe server running on local machine
export const LOCAL_URL =
  Platform.OS === 'android' ? 'http://10.0.0.107:3000' : 'http://localhost:4242';

export const API_URL = LOCAL_URL;