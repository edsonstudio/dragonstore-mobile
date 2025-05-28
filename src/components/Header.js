import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onCartPress }) => {
  return (
    <View style={styles.header}>
      <Image 
        source={require('../assets/images/logo-horizontal.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
        <Ionicons name="cart-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 90,
    marginTop: 30
  },
  logo: {
    width: 90,
    height: 30,
  },
  cartButton: {
    padding: 8,
  },
});

export default Header;