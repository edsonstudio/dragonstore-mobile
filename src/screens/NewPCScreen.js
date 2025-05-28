import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewPCScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monte seu Novo PC</Text>
      <Text style={styles.text}>Selecione os componentes para montar seu computador personalizado.</Text>
      {/* Aqui você pode adicionar os componentes de seleção de peças */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default NewPCScreen;