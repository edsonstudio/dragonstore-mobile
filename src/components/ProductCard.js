import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>Novo</Text>
      </View>
      
      <Image
        source={{ uri: `https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/${product.image}` }}
        style={styles.productImage}
        resizeMode="contain"
      />
      
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.brand} - {product.model}</Text>
      
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name="star" size={16} color="#FFD700" />
        ))}
        <Text style={styles.ratingText}>(+{product.ratingCount})</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.oldPrice}>R$ {(product.price * 3.5).toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.installment}>10x R$ {(product.price/10).toFixed(2).replace('.', ',')} sem juros</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => onAddToCart(product)}
      >
        <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onViewDetails(product)}>
        <Text style={styles.moreDetails}>Ver mais</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FF5722',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666666',
  },
  priceContainer: {
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  oldPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  installment: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  moreDetails: {
    color: '#2196F3',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ProductCard;