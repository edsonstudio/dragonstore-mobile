import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  // Dados de exemplo - substitua pelos itens do carrinho reais
  const cartItems = [
    { id: '1', name: 'Placa De Vídeo RTX 4060 Tl', price: 'R$ 2.999,00', quantity: 1 },
    { id: '2', name: 'Processador Intel i7', price: 'R$ 1.799,00', quantity: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);
  const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      
      {cartItems.length > 0 ? (
        <>
          <View style={styles.itemsContainer}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Ionicons name="remove" size={20} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Ionicons name="add" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {formattedTotal}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CartScreen;