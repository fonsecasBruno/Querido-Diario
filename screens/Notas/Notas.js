import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [novaNota, setNovaNota] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [notaEditando, setNotaEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [descricaoNota, setDescricaoNota] = useState('');

  useEffect(() => {
    obterNotas();
  }, []);

  const obterNotas = async () => {
    try {
      const notasSalvas = await AsyncStorage.getItem('notas');
      if (notasSalvas) {
        setNotas(JSON.parse(notasSalvas));
      }
    } catch (error) {
      console.error('Erro ao obter notas do AsyncStorage:', error);
    }
  };

  const adicionarOuEditarNota = async () => {
    let novasNotas;
    if (notaEditando !== null) {
      novasNotas = [...notas];
      novasNotas[notaEditando] = { titulo: novaNota, descricao: novaDescricao };
    } else {
      if (novaNota.trim() !== '') {
        novasNotas = [...notas, { titulo: novaNota, descricao: novaDescricao }];
      }
    }

    setNotas(novasNotas);
  
    try {
      
      await AsyncStorage.setItem('notas', JSON.stringify(novasNotas));
      setNovaNota('');
      setNovaDescricao('');
      fecharModal(); 
    } catch (error) {
      console.error('Erro ao salvar notas no AsyncStorage:', error);
    }
  };

  const adicionarNota = async () => {
    if (novaNota.trim() !== '') {
      const novasNotas = [...notas, { titulo: novaNota, descricao: '' }];
      setNotas(novasNotas);
  
      try {
        await AsyncStorage.setItem('notas', JSON.stringify(novasNotas));
        setNovaNota('');
      } catch (error) {
        console.error('Erro ao salvar notas no AsyncStorage:', error);
      }
    } else {
      console.error('Por favor, insira um título para a nova nota.');
    }
  };

  const editarNota = (index) => {
    setNovaNota(notas[index].titulo);
    setNovaDescricao(notas[index].descricao);
    setNotaEditando(index);
  };

  const removerNota = async (index) => {
    try {
      const novasNotas = notas.filter((_, i) => i !== index);
      setNotas(novasNotas);
  
      await AsyncStorage.setItem('notas', JSON.stringify(novasNotas));
    } catch (error) {
      console.error('Erro ao salvar notas no AsyncStorage:', error);
    } finally {
      fecharModal();
    }
  };  

  const abrirModal = (notaIndex) => {
    setNotaSelecionada(notaIndex);
    setDescricaoNota(notas[notaIndex]?.descricao || ''); 
    setModalVisible(true);
  };

  const fecharModal = () => {
    setNotaSelecionada(null);
    setModalVisible(false);
  };

  const salvarDescricaoNota = () => {
    const novasNotas = [...notas];
    novasNotas[notaSelecionada].descricao = descricaoNota;
  
    setNotas(novasNotas);
    fecharModal();
  
    try {
      AsyncStorage.setItem('notas', JSON.stringify(novasNotas));
    } catch (error) {
      console.error('Erro ao salvar notas no AsyncStorage:', error);
    }
  };

  const confirmarRemocaoNota = (index) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza de que deseja remover esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removerNota(index) },
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
             Notas
          </Animated.Text>
        </View>

        <View className='flex-row mt-10'>
          <TextInput
            className='bg-black/5 p-5 w-3/5 rounded-2xl ml-8'
            placeholder="Nova Nota"
            value={novaNota}
            onChangeText={(text) => setNovaNota(text)}
          />
          <TouchableOpacity
            className='justify-center bg-sky-950/80 rounded-2xl py-5 px-4 ml-3'
            onPress={adicionarNota}
          >
            <Text style={{ color: 'white' }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => abrirModal(index)} style={{ marginBottom: 10 }}>
              <Text className='text-2xl text-center font-bold text-sky-700'>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} animationType="slide">
          <View className='flex '>
            {notaSelecionada !== null && (
              <View>
                <Text className='text-center font-bold text-sky-700 text-3xl m-10'>
                {notas[notaSelecionada]?.titulo || ''}
                </Text>
                <TextInput
                  placeholder="Insira a descrição"
                  value={descricaoNota}
                  onChangeText={(text) => setDescricaoNota(text)}
                  multiline
                  className='bg-black/5 p-5 w-3/4 rounded-2xl mx-12 my-5'
                />
                <View className='flex-row m-6 justify-around mt-80'>
                  <TouchableOpacity onPress={salvarDescricaoNota} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarRemocaoNota(notaSelecionada)} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
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
