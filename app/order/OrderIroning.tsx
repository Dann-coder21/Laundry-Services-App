import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class OrderIroning extends Component {
  state = {
    itemType: 'Shirt',
    quantity: '1',
    instructions: '',
  };

  handleOrder = () => {
    // Handle form submission logic here
    alert('Order placed!');
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="iron-outline" size={36} color="#5E35B1" />
          <Text style={styles.title}>Order Ironing</Text>
        </View>

        <Text style={styles.label}>Item Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={this.state.itemType}
            style={styles.picker}
            onValueChange={itemType => this.setState({ itemType })}
          >
            <Picker.Item label="Shirt" value="Shirt" />
            <Picker.Item label="Trousers" value="Trousers" />
            <Picker.Item label="Dress" value="Dress" />
            <Picker.Item label="Bedsheet" value="Bedsheet" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={this.state.quantity}
          onChangeText={quantity => this.setState({ quantity })}
          placeholder="Enter quantity"
        />

        <Text style={styles.label}>Special Instructions</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={this.state.instructions}
          onChangeText={instructions => this.setState({ instructions })}
          placeholder="e.g. Use low heat, fold neatly"
        />

        <TouchableOpacity style={styles.button} onPress={this.handleOrder} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9F9F9',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5E35B1',
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginTop: 18,
    marginBottom: 6,
    fontWeight: '600',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0D7FA',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0D7FA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#5E35B1',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});