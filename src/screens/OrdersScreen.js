import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrdersScreen = () => {
  // Dados de exemplo - substitua pelos seus pedidos reais
  const orders = [
    { id: '1', date: '2023-05-01', total: 'R$ 2.999,00', status: 'Entregue' },
    { id: '2', date: '2023-05-15', total: 'R$ 4.500,00', status: 'Em transporte' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pedidos</Text>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderDate}>{item.date}</Text>
            <Text style={styles.orderTotal}>{item.total}</Text>
            <Text style={styles.orderStatus}>{item.status}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
  orderItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 14,
    color: '#2196F3',
    marginVertical: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default OrdersScreen;