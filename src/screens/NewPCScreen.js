import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../services/authService';

const NewPCScreen = ({ navigation }) => {
  const API_URL = "https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/";
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedParts, setSelectedParts] = useState({
    processor: null,
    motherboard: null,
    memory: null,
    gpu: null,
    hdd: null,
    ssd: null,
    psu: null,
    case: null,
    cooler: null,
    monitor: null,
    keyboard: null,
    mouse: null,
    headset: null
  });
  const [partsData, setPartsData] = useState({
    processors: [],
    motherboards: [],
    memories: [],
    gpus: [],
    hdds: [],
    ssds: [],
    psus: [],
    cases: [],
    coolers: [],
    monitors: [],
    keyboards: [],
    mouse: [],
    headsets: []
  });
  const [loading, setLoading] = useState(true);

  // Etapas do processo
  const steps = [
    { id: 'platform', title: 'Plataforma', required: true },
    { id: 'processor', title: 'Processador', required: true },
    { id: 'motherboard', title: 'Placa-mãe', required: true },
    { id: 'memory', title: 'Memória RAM', required: true },
    { id: 'gpu', title: 'Placa de Vídeo', required: true },
    { id: 'hdd', title: 'HD', required: true },
    { id: 'ssd', title: 'SSD', required: true },
    { id: 'psu', title: 'Fonte', required: true },
    { id: 'case', title: 'Gabinete', required: true },
    { id: 'cooler', title: 'Cooler', required: false },
    { id: 'monitor', title: 'Monitor', required: false },
    { id: 'keyboard', title: 'Teclado', required: false },
    { id: 'mouse', title: 'Mouse', required: false },
    { id: 'headset', title: 'Headset', required: false },
    { id: 'summary', title: 'Resumo', required: true }
  ];

  // Buscar peças do backend
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const token = await getToken();
        
        const responses = await Promise.all([
          fetch('https://catalog-dragonstore-hjedfrhugwhpdsdd.northeurope-01.azurewebsites.net/api/v2/Products', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        const data = await Promise.all(responses.map(res => res.json()));
        
        setPartsData({
          processors: data[0].filter(x => x.categoryName === "Processador").map(p => ({
            ...p,
            platform: p.name.toLowerCase().includes('intel') ? 'intel' : 'amd'
          })),
          motherboards: data[0].filter(x => x.categoryName === "placa-mae").map(p => ({
            ...p,
            platform: p.name.toLowerCase().includes('intel') ? 'intel' : 'amd'
          })),
          memories: data[0].filter(x => x.categoryName === "Memória RAM"),
          gpus: data[0].filter(x => x.categoryName === "Placa de vídeo"),
          hdds: data[0].filter(x => x.categoryName === "HD"),
          ssds: data[0].filter(x => x.categoryName === "SSD"),
          psus: data[0].filter(x => x.categoryName === "Fonte"),
          cases: data[0].filter(x => x.categoryName === "Gabinete"),
          coolers: data[0].filter(x => x.categoryName === "Cooler"),
          monitors: data[0].filter(x => x.categoryName === "Monitor"),
          keyboards: data[0].filter(x => x.categoryName === "Teclado"),
          mouse: data[0].filter(x => x.categoryName === "Mouse"),
          headsets: data[0].filter(x => x.categoryName === "Headset"),
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setLoading(false);
      }
    };
    
    fetchParts();
  }, []);

  // Avançar para próxima etapa
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Voltar para etapa anterior
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Selecionar peça
  const selectPart = (partType, part) => {
    setSelectedParts(prev => ({
      ...prev,
      [partType]: part
    }));
  };

  // Renderizar etapa atual
  const renderCurrentStep = () => {
    const currentStepId = steps[currentStep].id;
    
    if (currentStepId === 'platform') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha a plataforma</Text>
          <Text style={styles.stepSubtitle}>Você quer montar um setup AMD ou Intel?</Text>
          
          <TouchableOpacity 
            style={[styles.platformButton, selectedPlatform === 'intel' && styles.selectedPlatform]}
            onPress={() => setSelectedPlatform('intel')}
          >
            <Text style={styles.platformText}>Intel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.platformButton, selectedPlatform === 'amd' && styles.selectedPlatform]}
            onPress={() => setSelectedPlatform('amd')}
          >
            <Text style={styles.platformText}>AMD</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (currentStepId === 'processor') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o processador</Text>
          
          <FlatList
            data={partsData.processors.filter(p => p.platform === selectedPlatform)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.processor?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('processor', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'motherboard') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha a Placa-mãe</Text>
          
          <FlatList
            data={partsData.motherboards.filter(p => p.platform === selectedPlatform)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.motherboard?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('motherboard', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'memory') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha a memória</Text>
          
          <FlatList
            data={partsData.memories}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.memory?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('memory', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'gpu') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha a placa de vídeo</Text>
          
          <FlatList
            data={partsData.gpus}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.gpu?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('gpu', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'hdd') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o HD</Text>
          
          <FlatList
            data={partsData.hdds}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.hdd?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('hdd', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'ssd') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o SSD</Text>
          
          <FlatList
            data={partsData.ssds}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.ssd?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('ssd', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'psu') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha a fonte</Text>
          
          <FlatList
            data={partsData.psus}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.psu?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('psu', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'case') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o Gabinete</Text>
          
          <FlatList
            data={partsData.cases}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.case?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('case', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'cooler') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o Cooler</Text>
          
          <FlatList
            data={partsData.coolers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.cooler?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('cooler', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'monitor') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o monitor</Text>
          
          <FlatList
            data={partsData.monitors}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.monitor?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('monitor', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'keyboard') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o teclado</Text>
          
          <FlatList
            data={partsData.keyboards}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.keyboard?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('keyboard', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'mouse') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o mouse</Text>
          
          <FlatList
            data={partsData.mouses}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.mouse?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('mouse', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    if (currentStepId === 'headset') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Escolha o headset</Text>
          
          <FlatList
            data={partsData.headsets}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.partItem, selectedParts.headset?.id === item.id && styles.selectedPart]}
                onPress={() => selectPart('headset', item)}
              >
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.partImage} />
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partSpecs}>{item.specs}</Text>
                  <Text style={styles.partPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    
    // TODO: Adicionar os outros casos para cada tipo de peça seguindo o mesmo padrão, placa de video, fonte, etc...
    // TODO: Refatorar o codigo acima para usar um componete compartilhado/reutilizavel dentro de um laço.
    
    if (currentStepId === 'summary') {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Resumo do seu PC</Text>
          
          <ScrollView>
            {Object.entries(selectedParts).map(([key, part]) => {
              if (!part) return null;
              
              return (
                <View key={key} style={styles.summaryItem}>
                  <Text style={styles.summaryCategory}>{steps.find(s => s.id === key)?.title}</Text>
                  <Text style={styles.summaryName}>{part.name}</Text>
                  <Text style={styles.summaryPrice}>R$ {part.price.toFixed(2).replace('.', ',')}</Text>
                </View>
              );
            })}
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>
                R$ {Object.values(selectedParts)
                  .filter(part => part)
                  .reduce((sum, part) => sum + part.price, 0)
                  .toFixed(2)
                  .replace('.', ',')}
              </Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com breadcrumb */}
      <View style={styles.header}>
        <Text style={styles.breadcrumb}>
          Página inicial {steps.slice(0, currentStep + 1).map((step, i) => (
            <Text key={i}> &gt; {step.title}</Text>
          ))}
        </Text>
      </View>
      
      {/* Conteúdo da etapa atual */}
      {renderCurrentStep()}
      
      {/* Navegação */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.navButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < steps.length - 1 && (
          <TouchableOpacity 
            style={[
              styles.nextButton, 
              (steps[currentStep].required && 
              (
                (currentStep === 0 && !selectedPlatform) || // Verificação especial para plataforma
                (currentStep > 0 && !selectedParts[steps[currentStep].id])
              ) && styles.disabledButton
        )]}
            onPress={handleNext}
            disabled={
              steps[currentStep].required && 
              (
                (currentStep === 0 && !selectedPlatform) || // Verificação especial para plataforma
                (currentStep > 0 && !selectedParts[steps[currentStep].id])
              )
            }
          >
            <Text style={styles.navButtonText}>Avançar</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  breadcrumb: {
    fontSize: 14,
    color: '#666',
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  platformButton: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedPlatform: {
    backgroundColor: '#2196F3',
  },
  platformText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  partItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedPart: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  partImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partSpecs: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  partPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  summaryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryCategory: {
    fontSize: 14,
    color: '#666',
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryPrice: {
    fontSize: 16,
    color: '#2196F3',
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewPCScreen;