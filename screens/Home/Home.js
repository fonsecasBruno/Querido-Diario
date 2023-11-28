import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

    const navigation = useNavigation();
    
    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        obterUsuario();
    }, []);

    const obterUsuario = async () => {
        try {
        const nome = await AsyncStorage.getItem('usuario');
        if (nome) {
            setUsuario(nome);
        }
        } catch (error) {
            console.error('Erro ao obter o nome do usuário do AsyncStorage:', error);
        }
    };

    if (!usuario) {
        return null;
    }

  return (
    <View className='bg-white w-max h-max'>
      
      <StatusBar style='light'/>
        <Image className='h-full w-full absolute' source={require('../../assets/images/background.png')}/>

        <View className='flex-row justify-around w-full absolute'>
            <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[225] w-[90]' source={require('../../assets/images/light.png')}/>
            <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[160] w-[65]' source={require('../../assets/images/light.png')}/>
        </View>

      <View className='h-full w-full flex justify-around pt-40 pb-10'>
        <View className='flex items-center'>
        <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold -tracking-wider text-5xl mt-5'>
            Bem-Vindo!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold -tracking-wider text-5xl mt-5'>
            {usuario}
          </Animated.Text>
        </View>

        <View className='flex mt-15'>
    
        <View className='flex items-end space-y-6 mr-10'>
          <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-2/5 justify-center'>
            <TouchableOpacity
              onPress={() => navigation.navigate('Metas')}
            >
              <Text className='text-center text-sky-600 text-2xl'>Metas</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-2/5 mb-3 justify-center'>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notas')}
            >
              <Text className='text-center text-sky-600  text-2xl'>Notas</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View className='flex items-start space-y-6 ml-10'>
          <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-2/5 justify-center'>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sonhos')}
            >
              <Text className='text-center text-sky-600  text-2xl'>Sonhos</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-2/5 mb-3 justify-center'>
            <TouchableOpacity
              onPress={() => navigation.navigate('Ideias')}
            >
              <Text className='text-center text-sky-600  text-2xl'>Ideias</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        </View>
      </View>
    </View>
  );
}
