import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AuthModal from './AuthModal';
import { getToken, removeToken } from '../services/authService';

const Header = ({ onCartPress, cartItemsCount }) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await getToken();
    setIsLoggedIn(!!token);
  };

  const handleLogout = async () => {
    await removeToken();
    setIsLoggedIn(false);
    setAuthModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <Image 
        source={require('../assets/images/logo-horizontal.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          onPress={() => setAuthModalVisible(true)}
          style={[
            styles.iconButton, 
            isLoggedIn ? styles.loggedInButton : styles.loggedOutButton
          ]}
        >
        <Ionicons 
            name="person-outline" 
            size={24} 
            color={isLoggedIn ? '#FFF' : '#000'} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#000" />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <AuthModal 
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        isLoggedIn={isLoggedIn}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setAuthModalVisible(false);
        }}
        onLogout={handleLogout}
      />
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
    marginLeft: 10,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 20,
  },
  loggedInButton: {
    backgroundColor: '#4CAF50', // Verde quando logado
  },
  loggedOutButton: {
    backgroundColor: '#F44336', // Vermelho quando deslogado
  },
});

export default Header;