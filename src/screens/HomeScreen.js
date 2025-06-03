import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../services/authService';

const API_URL = "https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/api/v2/Products";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchProducts();
      await fetchCartItemsCount();
    };
    fetchInitialData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedProducts = data.map(product => ({
        ...product,
        rating: 5,
        ratingCount: 50
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItemsCount = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setCartItemsCount(0);
        return;
      }

      const response = await fetch(
        'https://dragonstore-bff-cjcne7ahgwb3fjg6.brazilsouth-01.azurewebsites.net/api/v1/compras/carrinho-quantidade',
        {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const count = await response.text();
        setCartItemsCount(parseInt(count) || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar quantidade do carrinho:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Atenção', 'Você precisa estar logado para adicionar itens ao carrinho');
        return;
      }

      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        amount: 1
      };

      const response = await fetch(
        'https://dragonstore-bff-cjcne7ahgwb3fjg6.brazilsouth-01.azurewebsites.net/api/v1/compras/carrinho/items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(cartItem)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao adicionar ao carrinho');
      }

      Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
      await fetchCartItemsCount(); // Atualiza o contador
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o item ao carrinho');
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>Novo</Text>
      </View>
      
      <Image
        source={{ uri: `https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/${item.image}` }}
        style={styles.productImage}
        resizeMode="contain"
      />
      
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.brand} - {item.model}</Text>
      
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name="star" size={16} color="#FFD700" />
        ))}
        <Text style={styles.ratingText}>(+{item.ratingCount})</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.oldPrice}>R$ {(item.price * 3.5).toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.installment}>10x R$ {(item.price/10).toFixed(2).replace('.', ',')} sem juros</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
      >
        <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => openProductDetails(item)}>
        <Text style={styles.moreDetails}>Ver mais</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Catálogo de Peças" 
        onCartPress={() => navigation.navigate('Cart')} 
        cartItemsCount={cartItemsCount}
      />
      
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedProduct?.description.split('\n').map((line, i) => (
                  <Text key={i}>
                    {line}
                    {'\n\n'}
                  </Text>
                ))}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default HomeScreen;