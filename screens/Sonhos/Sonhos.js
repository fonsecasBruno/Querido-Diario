import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function Sonhos() {
  const [sonhos, setSonhos] = useState([]);
  const [novoSonho, setNovoSonho] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [sonhoEditando, setSonhoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sonhoSelecionado, setSonhoSelecionado] = useState(null);
  const [descricaoSonho, setDescricaoSonho] = useState('');

  useEffect(() => {
    obterSonhos();
  }, []);

  const obterSonhos = async () => {
    try {
      const sonhosSalvos = await AsyncStorage.getItem('sonhos');
      if (sonhosSalvos) {
        setSonhos(JSON.parse(sonhosSalvos));
      }
    } catch (error) {
      console.error('Erro ao obter sonhos do AsyncStorage:', error);
    }
  };

  const adicionarOuEditarSonho = async () => {
    let novosSonhos;
    if (sonhoEditando !== null) {
      novosSonhos = [...sonhos];
      novosSonhos[sonhoEditando] = { titulo: novoSonho, descricao: novaDescricao };
    } else {
      if (novoSonho.trim() !== '') {
        novosSonhos = [...sonhos, { titulo: novoSonho, descricao: novaDescricao }];
      }
    }

    setSonhos(novosSonhos);

    try {
      await AsyncStorage.setItem('sonhos', JSON.stringify(novosSonhos));
      setNovoSonho('');
      setNovaDescricao('');
      fecharModal(); 
    } catch (error) {
      console.error('Erro ao salvar sonhos no AsyncStorage:', error);
    }
  };

  const adicionarSonho = async () => {
    if (novoSonho.trim() !== '') {
      const novosSonhos = [...sonhos, { titulo: novoSonho, descricao: '' }];
      setSonhos(novosSonhos);

      try {
        await AsyncStorage.setItem('sonhos', JSON.stringify(novosSonhos));
        setNovoSonho('');
      } catch (error) {
        console.error('Erro ao salvar sonhos no AsyncStorage:', error);
      }
    } else {
      console.error('Por favor, insira um título para o novo sonho.');
    }
  };

  const editarSonho = (index) => {
    setNovoSonho(sonhos[index].titulo);
    setNovaDescricao(sonhos[index].descricao);
    setSonhoEditando(index);
  };

  const removerSonho = async (index) => {
    try {
      const novosSonhos = sonhos.filter((_, i) => i !== index);
      setSonhos(novosSonhos);
  
      await AsyncStorage.setItem('sonhos', JSON.stringify(novosSonhos));
    } catch (error) {
      console.error('Erro ao salvar sonhos no AsyncStorage:', error);
    } finally {
      fecharModal();
    }
  };  

  const abrirModal = (sonhoIndex) => {
    setSonhoSelecionado(sonhoIndex);
    setDescricaoSonho(sonhos[sonhoIndex]?.descricao || ''); 
    setModalVisible(true);
  };

  const fecharModal = () => {
    setSonhoSelecionado(null);
    setModalVisible(false);
  };

  const salvarDescricaoSonho = () => {
    const novosSonhos = [...sonhos];
    novosSonhos[sonhoSelecionado].descricao = descricaoSonho;
  
    setSonhos(novosSonhos);
    fecharModal();
  
    try {
      AsyncStorage.setItem('sonhos', JSON.stringify(novosSonhos));
    } catch (error) {
      console.error('Erro ao salvar sonhos no AsyncStorage:', error);
    }
  };

  const confirmarRemocaoSonho = (index) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza de que deseja remover este sonho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removerSonho(index) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className='bg-white h-full w-full'>
      <StatusBar style='light'/>
      <Image className='h-full w-full absolute' source={require('../../assets/images/background.png')}/>

      <View className='flex-row justify-around w-full absolute'>
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[225] w-[90]' source={require('../../assets/images/light.png')}/>
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[160] w-[65]' source={require('../../assets/images/light.png')}/>
      </View>
    
      <View className='h-full w-full flex justify-around pt-60'>
        <View className='flex items-center'>
          <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold -tracking-wider text-5xl'>
             Sonhos
          </Animated.Text>
        </View>

        <View className='flex-row mt-10'>
          <TextInput
            className='bg-black/5 p-5 w-3/5 rounded-2xl ml-8'
            placeholder="Novo Sonho"
            value={novoSonho}
            onChangeText={(text) => setNovoSonho(text)}
          />
          <TouchableOpacity
            className='justify-center bg-sky-950/80 rounded-2xl py-5 px-4 ml-3'
            onPress={adicionarSonho}
          >
            <Text style={{ color: 'white' }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sonhos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => abrirModal(index)} style={{ marginBottom: 10 }}>
              <Text className='text-2xl text-center font-bold text-sky-700'>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} animationType="slide">
          <View className='flex '>
            {sonhoSelecionado !== null && (
              <View>
                <Text className='text-center font-bold text-sky-700 text-3xl m-10'>
                  {sonhos[sonhoSelecionado]?.titulo || ''}
                </Text>
                <TextInput
                  placeholder="Insira a descrição"
                  value={descricaoSonho}
                  onChangeText={(text) => setDescricaoSonho(text)}
                  multiline
                  className='bg-black/5 p-5 w-3/4 rounded-2xl mx-12 my-5'
                />
                <View className='flex-row m-6 justify-around mt-80'>
                  <TouchableOpacity onPress={salvarDescricaoSonho} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarRemocaoSonho(sonhoSelecionado)} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Remover</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={fecharModal} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>

      </View>
    </View>
  );
}
