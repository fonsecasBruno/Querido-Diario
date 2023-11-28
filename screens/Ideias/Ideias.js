import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function Ideias() {
  const [ideias, setIdeias] = useState([]);
  const [novaIdeia, setNovaIdeia] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [ideiaEditando, setIdeiaEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ideiaSelecionada, setIdeiaSelecionada] = useState(null);
  const [descricaoIdeia, setDescricaoIdeia] = useState('');

  useEffect(() => {
    obterIdeias();
  }, []);

  const obterIdeias = async () => {
    try {
      const ideiasSalvas = await AsyncStorage.getItem('ideias');
      if (ideiasSalvas) {
        setIdeias(JSON.parse(ideiasSalvas));
      }
    } catch (error) {
      console.error('Erro ao obter ideias do AsyncStorage:', error);
    }
  };

  const adicionarOuEditarIdeia = async () => {
    let novasIdeias;
    if (ideiaEditando !== null) {
      novasIdeias = [...ideias];
      novasIdeias[ideiaEditando] = { titulo: novaIdeia, descricao: novaDescricao };
    } else {
      if (novaIdeia.trim() !== '') {
        novasIdeias = [...ideias, { titulo: novaIdeia, descricao: novaDescricao }];
      }
    }

    setIdeias(novasIdeias);
  
    try {
      await AsyncStorage.setItem('ideias', JSON.stringify(novasIdeias));
      setNovaIdeia('');
      setNovaDescricao('');
      fecharModal(); 
    } catch (error) {
      console.error('Erro ao salvar ideias no AsyncStorage:', error);
    }
  };

  const adicionarIdeia = async () => {
    if (novaIdeia.trim() !== '') {
      const novasIdeias = [...ideias, { titulo: novaIdeia, descricao: '' }];
      setIdeias(novasIdeias);
  
      try {
        await AsyncStorage.setItem('ideias', JSON.stringify(novasIdeias));
        setNovaIdeia('');
      } catch (error) {
        console.error('Erro ao salvar ideias no AsyncStorage:', error);
      }
    } else {
      console.error('Por favor, insira um título para a nova ideia.');
    }
  };

  const editarIdeia = (index) => {
    setNovaIdeia(ideias[index].titulo);
    setNovaDescricao(ideias[index].descricao);
    setIdeiaEditando(index);
  };

  const removerIdeia = async (index) => {
    try {
      const novasIdeias = ideias.filter((_, i) => i !== index);
      setIdeias(novasIdeias);
  
      await AsyncStorage.setItem('ideias', JSON.stringify(novasIdeias));
    } catch (error) {
      console.error('Erro ao salvar ideias no AsyncStorage:', error);
    } finally {
      fecharModal();
    }
  };  

  const abrirModal = (ideiaIndex) => {
    setIdeiaSelecionada(ideiaIndex);
    setDescricaoIdeia(ideias[ideiaIndex]?.descricao || ''); 
    setModalVisible(true);
  };

  const fecharModal = () => {
    setIdeiaSelecionada(null);
    setModalVisible(false);
  };

  const salvarDescricaoIdeia = () => {
    const novasIdeias = [...ideias];
    novasIdeias[ideiaSelecionada].descricao = descricaoIdeia;
  
    setIdeias(novasIdeias);
    fecharModal();
  
    try {
      AsyncStorage.setItem('ideias', JSON.stringify(novasIdeias));
    } catch (error) {
      console.error('Erro ao salvar ideias no AsyncStorage:', error);
    }
  };

  const confirmarRemocaoIdeia = (index) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza de que deseja remover esta ideia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removerIdeia(index) },
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
             Ideias
          </Animated.Text>
        </View>

        <View className='flex-row mt-10'>
          <TextInput
            className='bg-black/5 p-5 w-3/5 rounded-2xl ml-8'
            placeholder="Nova Ideia"
            value={novaIdeia}
            onChangeText={(text) => setNovaIdeia(text)}
          />
          <TouchableOpacity
            className='justify-center bg-sky-950/80 rounded-2xl py-5 px-4 ml-3'
            onPress={adicionarIdeia}
          >
            <Text style={{ color: 'white' }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={ideias}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => abrirModal(index)} style={{ marginBottom: 10 }}>
              <Text className='text-2xl text-center font-bold text-sky-700'>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} animationType="slide">
          <View className='flex '>
            {ideiaSelecionada !== null && (
              <View>
                <Text className='text-center font-bold text-sky-700 text-3xl m-10'>
                  {ideias[ideiaSelecionada]?.titulo || ''}
                </Text>
                <TextInput
                  placeholder="Insira a descrição"
                  value={descricaoIdeia}
                  onChangeText={(text) => setDescricaoIdeia(text)}
                  multiline
                  className='bg-black/5 p-5 w-3/4 rounded-2xl mx-12 my-5'
                />
                <View className='flex-row m-6 justify-around mt-80'>
                  <TouchableOpacity onPress={salvarDescricaoIdeia} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarRemocaoIdeia(ideiaSelecionada)} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
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
