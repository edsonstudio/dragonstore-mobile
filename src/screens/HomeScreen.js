import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const HomeScreen = () => {
  const navigation = useNavigation();

  const products = [
    {
      id: 1,
      name: 'Placa De Vídeo RTX 4060 Tl',
      description: 'Ventus 2x Oc, MSI, Nvidia,...',
      price: 2999.00,
      oldPrice: 10500.00,
      installments: 10,
      ratingCount: 50,
    },
    // Adicione mais produtos conforme necessário
  ];

  const handleAddToCart = (product) => {
    console.log('Adicionado ao carrinho:', product);
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <Header onCartPress={handleCartPress} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Catálogo de Peças</Text>
        
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;