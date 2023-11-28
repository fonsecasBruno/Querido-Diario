import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function Metas() {
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [metaEditando, setMetaEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [descricaoMeta, setDescricaoMeta] = useState('');

  useEffect(() => {
    obterMetas();
  }, []);

  const obterMetas = async () => {
    try {
      const metasSalvas = await AsyncStorage.getItem('metas');
      if (metasSalvas) {
        setMetas(JSON.parse(metasSalvas));
      } else {
        setMetas([]);
      }
    } catch (error) {
      console.error('Erro ao obter metas do AsyncStorage:', error);
    }
  };

  const adicionarOuEditarMeta = async () => {
    if (novaMeta.trim() === '') {
      console.error('Por favor, insira um título para a nova meta.');
      return;
    }

    let novasMetas;
    if (metaEditando !== null) {
      novasMetas = [...metas];
      novasMetas[metaEditando] = { titulo: novaMeta, descricao: novaDescricao.trim() || '' };
    } else {
      novasMetas = [...metas, { titulo: novaMeta, descricao: novaDescricao.trim() || '' }];
    }

    try {
      await AsyncStorage.setItem('metas', JSON.stringify(novasMetas));
      setMetas(novasMetas);
      setNovaMeta('');
      setNovaDescricao('');
      fecharModal(); 
    } catch (error) {
      console.error('Erro ao salvar metas no AsyncStorage:', error);
    }
  };

  const editarMeta = (index) => {
    setNovaMeta(metas[index].titulo);
    setNovaDescricao(metas[index].descricao);
    setMetaEditando(index);
  };

  const removerMeta = async (index) => {
    try {
      const novasMetas = metas.filter((_, i) => i !== index);
      setMetas(novasMetas);

      await AsyncStorage.setItem('metas', JSON.stringify(novasMetas));
    } catch (error) {
      console.error('Erro ao salvar metas no AsyncStorage:', error);
    } finally {
      fecharModal();
    }
  };

  const abrirModal = (metaIndex) => {
    setMetaSelecionada(metaIndex);
    setDescricaoMeta(metas[metaIndex]?.descricao || ''); 
    setModalVisible(true);
  };

  const fecharModal = () => {
    setMetaSelecionada(null);
    setModalVisible(false);
  };

  const adicionarMeta = async () => {
    if (novaMeta.trim() !== '') {
      let novasMetas;
      if (metaEditando !== null) {

      } else {
        novasMetas = metas ? [...metas, { titulo: novaMeta, descricao: novaDescricao.trim() || '' }] : [{ titulo: novaMeta, descricao: novaDescricao.trim() || '' }];
      }
  
      setMetas(novasMetas);
  
      try {
        await AsyncStorage.setItem('metas', JSON.stringify(novasMetas));
        setNovaMeta('');
        setNovaDescricao('');
        fecharModal(); 
      } catch (error) {
        console.error('Erro ao salvar metas no AsyncStorage:', error);
      }
    } else {
      console.error('Por favor, insira um título para a nova meta.');
    }
  };

  const salvarDescricaoMeta = () => {
    if (metaSelecionada !== null && metas[metaSelecionada]) {
      const novasMetas = [...metas];
      novasMetas[metaSelecionada].descricao = descricaoMeta;
  
      setMetas(novasMetas);
      fecharModal();
  
      try {
        AsyncStorage.setItem('metas', JSON.stringify(novasMetas));
      } catch (error) {
        console.error('Erro ao salvar metas no AsyncStorage:', error);
      }
    }
  };  

  const confirmarRemocaoMeta = (index) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza de que deseja remover esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removerMeta(index) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className='bg-white h-full w-full'>
      <StatusBar style='light' />
      <Image className='h-full w-full absolute' source={require('../../assets/images/background.png')} />

      <View className='flex-row justify-around w-full absolute'>
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[225] w-[90]' source={require('../../assets/images/light.png')} />
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[160] w-[65]' source={require('../../assets/images/light.png')} />
      </View>

      <View className='h-full w-full flex justify-around pt-60'>
        <View className='flex items-center'>
          <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold -tracking-wider text-5xl'>
            Metas
          </Animated.Text>
        </View>

        <View className='flex-row mt-10'>
          <TextInput
            className='bg-black/5 p-5 w-3/5 rounded-2xl ml-8'
            placeholder="Nova Meta"
            value={novaMeta}
            onChangeText={(text) => setNovaMeta(text)}
          />
          <TouchableOpacity
            className='justify-center bg-sky-950/80 rounded-2xl py-5 px-4 ml-3'
            onPress={adicionarOuEditarMeta}
          >
            <Text style={{ color: 'white' }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={metas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => abrirModal(index)} style={{ marginBottom: 10 }}>
              <Text className='text-2xl text-center font-bold text-sky-700'>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} animationType="slide">
          <View className='flex '>
            {metaSelecionada !== null && (
              <View>
                <Text className='text-center font-bold text-sky-700 text-3xl m-10'>
                  {metas[metaSelecionada]?.titulo || ''}
                </Text>
                <TextInput
                  placeholder="Insira a descrição"
                  value={descricaoMeta}
                  onChangeText={(text) => setDescricaoMeta(text)}
                  multiline
                  className='bg-black/5 p-5 w-3/4 rounded-2xl mx-12 my-5'
                />
                <View className='flex-row m-6 justify-around mt-80'>
                  <TouchableOpacity onPress={salvarDescricaoMeta} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
                    <Text className='text-center text-white'>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarRemocaoMeta(metaSelecionada)} className='bg-sky-950/90 p-5 rounded-2xl w-1/4'>
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
