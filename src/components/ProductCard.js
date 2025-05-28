import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>Novo</Text>
      </View>
      
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      
      <View style={styles.rating}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>+</Text>
        ))}
        <Text style={styles.ratingCount}>(+{product.ratingCount})</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.oldPrice}>R$ {product.oldPrice.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.installment}>
          {product.installments}x R$ {(product.price/product.installments).toFixed(2).replace('.', ',')} sem juros
        </Text>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
        <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.moreText}>Ver mais</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  star: {
    color: '#FFC107',
    marginRight: 4,
  },
  ratingCount: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  installment: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  moreText: {
    color: '#2196F3',
    textAlign: 'center',
  },
});

export default ProductCard;