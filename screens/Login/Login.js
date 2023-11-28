import { Image, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {

            const storedEmail = await AsyncStorage.getItem('email');
            const storedSenha = await AsyncStorage.getItem('senha');

        if (email === storedEmail && senha === storedSenha) {
            console.log('Login bem-sucedido!');
        
            navigation.navigate('Home');
        } else {
            console.log('Credenciais inválidas. Tente novamente.');
        }
        } catch (error) {
            console.error('Erro ao obter informações do AsyncStorage:', error);
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

        <View className='h-full w-full flex justify-around pt-40 pb-10'>
            <View className='flex items-center'>
                <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold -tracking-wider text-5xl'>
                    Login
                </Animated.Text>
            </View>
            <View className='flex items-center mx-4 space-y-4'>
                <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-full'>
                    <TextInput placeholder='Email' placeholderTextColor={'gray'} onChangeText={(text) => setEmail(text)}/>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className='bg-black/5 p-5 rounded-2xl w-full mb-3'>
                    <TextInput placeholder='Senha' placeholderTextColor={'gray'} secureTextEntry={true} textContentType='password' autoCorrect={false} onChangeText={(text) => setSenha(text)}/>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full'>
                    <TouchableOpacity
                        className='w-full bg-sky-400 p-3 rounded-2xl mb-3'
                        onPress={handleLogin}
                    >
                        <Text className='text-xl font-bold text-white text-center'>Login</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className='flex-row justify-center'>
                    <Text>Não tem uma conta?</Text>
                    <TouchableOpacity onPress={()=> navigation.push('Registro')}>
                        <Text className='text-sky-600'> Registre-se</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    </View>
  )
}
