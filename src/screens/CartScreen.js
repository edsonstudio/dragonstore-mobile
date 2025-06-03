import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../services/authService';

const CartScreen = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Você precisa estar logado para ver o carrinho');
        return;
      }

      const response = await fetch(
        'https://dragonstore-bff-cjcne7ahgwb3fjg6.brazilsouth-01.azurewebsites.net/api/v1/compras/carrinho',
        {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar carrinho');
      }

      const data = await response.json();
      setCartData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `https://dragonstore-bff-cjcne7ahgwb3fjg6.brazilsouth-01.azurewebsites.net/api/v1/compras/carrinho/items/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover item');
      }

      Alert.alert('Sucesso', 'Item removido do carrinho!');
      await fetchCartData();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível remover o item');
    }
  };

  const handleUpdateQuantity = async (productId, newAmount) => {
    if (newAmount < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const token = await getToken();
      const item = cartData.items.find(item => item.productId === productId);
      
      if (!item) {
        throw new Error('Item não encontrado no carrinho');
      }

      const response = await fetch(
        `https://dragonstore-bff-cjcne7ahgwb3fjg6.brazilsouth-01.azurewebsites.net/api/v1/compras/carrinho/items/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: newAmount,
            image: item.image,
            name: item.name,
            price: item.price,
            productId: item.productId
          })
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar quantidade');
      }

      await fetchCartData();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade');
      console.error('Erro ao atualizar quantidade:', err);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/${item.image}` }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.productId, item.amount - 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.amount}</Text>
          
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.productId, item.amount + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => handleRemoveItem(item.productId)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#999" />
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartData.items}
        renderItem={renderCartItem}
        keyExtractor={item => item.productId}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            R$ {cartData.totalPrice.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        {cartData.desconto > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Desconto:</Text>
            <Text style={[styles.summaryValue, styles.discountText]}>
              - R$ {cartData.desconto.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            R$ {(cartData.totalPrice - cartData.desconto).toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginBottom: 35
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 150, // Espaço para o resumo
  },
  cartItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  discountText: {
    color: '#4CAF50',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;