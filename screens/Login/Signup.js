import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup() {

    const navigation = useNavigation();

    const [usuario, setUsuario] = useState([]);
    const [email, setEmail] = useState([]);
    const [senha, setSenha] = useState([]);
    const [data, setData] = useState([]);

    function validarSenha(senha) {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
        return regex.test(senha)
    }

    const handleRegister = async () => {

        console.log('Valores dos campos:', usuario, email, senha, data);

        if (!validarSenha(senha)) {
            console.error('Campo de senha inválido');
          }

        if (validarSenha(senha)) {
          try {
            
            await AsyncStorage.setItem('usuario', usuario);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('senha', senha);
            
            if (data !== undefined) {
                await AsyncStorage.setItem('data', data || '');
              }
    
            console.log('Registro bem-sucedido!');

            navigation.navigate('Home');

          } catch (error) {
            console.error('Erro ao salvar as informações:', error);
          }
        } else {
          console.error('Preencha todos os campos corretamente.');
        }
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
                    Registro
                </Animated.Text>
            </View>
            <View className='flex items-center mx-4 space-y-4'>
                <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput placeholder='Usuário' placeholderTextColor={'gray'} onChangeText={(text) => setUsuario(text)}/>
                </Animated.View>
                <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput placeholder='Email' placeholderTextColor={'gray'} onChangeText={(text) => setEmail(text)}/>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput placeholder='Senha' placeholderTextColor={'gray'} secureTextEntry={true} textContentType='password' autoCorrect={false} onChangeText={(text) => setSenha(text)}/>
                </Animated.View>
                <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-3 rounded-2xl w-full mb-3'>
                    <TextInputMask
                        placeholder='Data de Nascimento' 
                        placeholderTextColor={'gray'}
                        type={'datetime'}
                        options={{
                            format: 'DD/MM/YYYY'
                        }}
                        value={data}
                        onChangeText={(formatted, extracted) => setData(extracted)}
                    />
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full'>
                    <TouchableOpacity
                        className='w-full bg-sky-400 p-3 rounded-2xl mb-3'
                        onPress={handleRegister}
                    >
                        <Text className='text-xl font-bold text-white text-center'>Registre</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className='flex-row justify-center'>
                    <Text>Já tem uma conta?</Text>
                    <TouchableOpacity onPress={()=> navigation.push('Login')}>
                        <Text className='text-sky-600'> Acesse aqui </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    </View>
  )
}

