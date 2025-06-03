import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken, setToken, removeToken } from '../services/authService';

const AuthModal = ({ visible, onClose, isLoggedIn, onLoginSuccess, onLogout }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      // Reset form when modal closes
      setLoginData({ email: '', password: '' });
      setRegisterData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setActiveTab('login');
    }
  }, [visible]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://auth-dragonstore-h6fdd6gde2gedndy.northeurope-01.azurewebsites.net/api/v2/identity/autenticar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.title || 'Erro ao fazer login');
      }

      await setToken(data.accessToken);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const registerDataJson = JSON.stringify({
      name: registerData.name,
      cpf: registerData.cpf.toString(),
      phone: registerData.phone.toString(),
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    });
    try {
      const response = await fetch(
        'https://auth-dragonstore-h6fdd6gde2gedndy.northeurope-01.azurewebsites.net/api/v2/identity/nova-conta',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: registerDataJson,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.title || 'Erro ao registrar');
      }

      // Faz login automaticamente após cadastro
      await setToken(data.accessToken);
      onLoginSuccess();
    } catch (err) {
      setError(err.message); // TODO: Criar um tratamento de erros mais robusto, interceptor para loading, centralizar os endpoints em services.
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeToken();
    onLogout();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {isLoggedIn ? (
            <View style={styles.loggedInContainer}>
              <Text style={styles.welcomeText}>Você está logado!</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                  onPress={() => setActiveTab('login')}
                >
                  <Text style={styles.tabText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                  onPress={() => setActiveTab('register')}
                >
                  <Text style={styles.tabText}>Cadastro</Text>
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {activeTab === 'login' ? (
                <ScrollView contentContainerStyle={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={loginData.email}
                    onChangeText={(text) => setLoginData({...loginData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={loginData.password}
                    onChangeText={(text) => setLoginData({...loginData, password: text})}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Carregando...' : 'Entrar'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <ScrollView contentContainerStyle={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    value={registerData.name}
                    onChangeText={(text) => setRegisterData({...registerData, name: text})}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="CPF"
                    value={registerData.cpf}
                    onChangeText={(text) => setRegisterData({...registerData, cpf: text})}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    value={registerData.phone}
                    onChangeText={(text) => setRegisterData({...registerData, phone: text})}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={registerData.email}
                    onChangeText={(text) => setRegisterData({...registerData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={registerData.password}
                    onChangeText={(text) => setRegisterData({...registerData, password: text})}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    value={registerData.confirmPassword}
                    onChangeText={(text) => setRegisterData({...registerData, confirmPassword: text})}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Carregando...' : 'Cadastrar'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  loggedInContainer: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 4,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AuthModal;