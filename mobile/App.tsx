import React, {useState} from 'react';
import {Button, StyleSheet, Alert, View, TextInput, Text} from 'react-native';
import 'react-native-gesture-handler';
import {colors} from './colors';
import { StripeProvider, useStripe, CardField, useConfirmPayment, CardFieldInput, PaymentMethodCreateParams} from '@stripe/stripe-react-native';
import {API_URL} from './config';

export default function App() {

  const [email, setEmail] = useState('');
  const {confirmPayment, loading} = useConfirmPayment();
  const stripe = useStripe();

  const handlePayPress = async () => {

    const response = await fetch(`${API_URL}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      }),
    });

    const {client_secret} = await response.json();


    // 2. Gather customer billing information (ex. email)
    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      email,
    };

    const {error, paymentIntent} = await confirmPayment(client_secret, {
      type: 'Card',
      billingDetails,
    });

    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
      console.log('Erro na confirmação do pagamento', error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Sucesso',
        `Seu pagamento foi processado com sucesso!`
      );
      console.log('Sucesso!', paymentIntent);
    }
  };

  const handleSubPress = async () => {

    const result = await stripe.createPaymentMethod({
      type: 'Card',
    });

    if (result.error) {
      Alert.alert(`Error code: ${result.error.code}`, result.error.message);
      console.log(result.error.message);
    } else {
    const response = await fetch(`${API_URL}/sub`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        payment_method: result.paymentMethod.id
      }),
    });
    Alert.alert(
      'Sucesso',
      `Sua assinatura foi processado com sucesso!`
    );
    }
  }

  return (
    <StripeProvider
      publishableKey={'pk_test_51JKQNoAhUJiT8MhhkgytqJQCrJVZwaj0rZFVBIiKXHJ4n1X2T1QNCOgfVY2MTispGDIUvxONjWMjZhq36SSg28OJ00KlbkB7tf'}
    >
      <View style={styles.container}>
      <TextInput 
        value={email} 
        onChangeText={(e) => setEmail(e)}
        autoCapitalize="none"
        keyboardType="email-address" 
        placeholder="E-mail" 
        style={styles.input} 
      />
      <CardField
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={inputStyles}
        style={styles.cardField}
      />
      <Button onPress={handlePayPress} title="Pagamento" disabled={loading}/>
      <Button onPress={handleSubPress} title="Assinatura" disabled={loading}/>
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  input: {
    height: 44,
    borderBottomColor: colors.slate,
    borderBottomWidth: 1.5,
  },
  button: {
    marginBottom: 5
  }
});

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
};