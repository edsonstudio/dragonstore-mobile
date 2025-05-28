import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomTabNavigator = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons 
          name="home-outline" 
          size={24} 
          color={state.index === 0 ? '#2196F3' : '#666'} 
        />
        <Text style={[styles.tabText, state.index === 0 && styles.activeTabText]}>
          Início
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('NewPC')}
      >
        <Ionicons 
          name="desktop-outline" 
          size={24} 
          color={state.index === 1 ? '#2196F3' : '#666'} 
        />
        <Text style={[styles.tabText, state.index === 1 && styles.activeTabText]}>
          Novo PC
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Orders')}
      >
        <Ionicons 
          name="list-outline" 
          size={24} 
          color={state.index === 2 ? '#2196F3' : '#666'} 
        />
        <Text style={[styles.tabText, state.index === 2 && styles.activeTabText]}>
          Pedidos
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;