import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from 'expo-router';
import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    shadowColor: '#7F39A6',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  }

  const forgotPassword = () => {
    console.log("Forgot password pressed");
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Please  fill in email and password');
      return;
    }
      if (activeTab === 'signup') {
        if(!username) {
          Alert.alert('Please choose a username');
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert('Passwords do not match');
          return;
        }
    }

    setLoading(true);
    const { error } =
    activeTab === 'signup'
    ? await supabase.auth.signUp({email: email.trim(), password, options: {data: {username: username.trim() }},})
    : await supabase.auth.signInWithPassword({email: email.trim(), password});
    setLoading(false);

    if (error){
      Alert.alert(activeTab === 'signup' ? 'Signup failed' : 'Login failed', error.message);
      return;
    }

    router.replace('/(tabs)/dashboard' as any);
  };
  const handleGoogle = () => {
    console.log("Google sign in pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EAD4F6]">
      <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
  
      <View style={{ width: 140, height: 140, borderRadius: 999 }} className="bg-[#E2BFF6] overflow-hidden mb-4 mt-2" >
        <Image source={require('../assets/images/wavinglogo.png')}
        className="w-full h-full"
        resizeMode="contain" />
      </View>

      <View>
        <Text className="font-pixel text-5xl mb-2">Engest</Text>
        <Text className=" font-pixel text-2xl text-center text-[#675F5F] mb-4">Põlvest põlve</Text>
      </View>

      <View className=" flex-row bg-[#DEA9FD] rounded-full p-1"style={inputStyle}>
      <Pressable 
        onPress={() => setActiveTab('login')}
        className={`rounded-full px-6 py-4 ${activeTab === 'login' ? 'bg-[#CF8DF6]': 'bg-transparent'}`}>
        <Text className=" font-pixel" >Log In</Text>
      </Pressable>
      <Pressable onPress={() => setActiveTab('signup')}
      className={`rounded-full px-4 py-4 ${activeTab === 'signup' ? 'bg-[#CF8DF6]': 'bg-transparent'}`}>
          <Text className=" font-pixel" >Sign Up</Text>
        </Pressable>
      </View>

      {activeTab === 'login' ? (

    <View className='w-full px-20'>
      <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4 mb-4 mt-4">
        <View className='mr-2'>
        <MaterialCommunityIcons name="human" size={24} color="#7F39A6"  />
        </View>
        <TextInput placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#675F5F"
          className="flex-1 font-pixel"
         />
      </View>

      <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4">
      <View className='mr-2'>
      <Entypo name="lock" size={20} color="#7F39A6" />
      </View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#675F5F"
          className="flex-1 font-pixel"/>
      </View>
      <Pressable onPress={forgotPassword} className="mb-6">
        <Text className="font-pixel text-right text-[#675F5F] text-sm">
          Forgot password?</Text>
      </Pressable>

        <Pressable onPress={handleSubmit} className="rounded-full bg-[#CF8DF5] border border-[#543666] px-8 py-4"
          style={inputStyle}>
          <Text className="text-center font-pixel text-black">
            Log In
          </Text> 
        </Pressable>
        <Text className=" font-pixel text-base text-center text-[#675F5F] mt-3 mb-3">Or</Text>
            <Pressable onPress={handleGoogle} className="rounded-full bg-[#E2BFF6] border border-[#543666] py-3 "
              style={inputStyle}>
                 <View className="flex-row items-center px-6 justify-content">
                <Image source={require('../assets/images/google.png')} style={{ width: 18, height: 24 }} resizeMode="contain"/>
              <Text className=" flex-1 text-center font-pixel text-black ">
                Google
              </Text> 
              </View>
            </Pressable>
     </View>

        ) : (
          <View className='w-full px-20'>
             <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4 mt-4">
              <View className='mr-2'> 
              <MaterialCommunityIcons name="human" size={24} color="#7F39A6"  />
              </View>
            <TextInput placeholder=" Set email" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#675F5F"
              className="flex-1 font-pixel"/>
              </View>

              <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4 mt-4">
              <View className='mr-2'> 
              <AntDesign name="smile" size={20} color="#7F39A6" />
              </View>
            <TextInput placeholder="Set username" 
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#675F5F"
              className="flex-1 font-pixel"/>
              </View>

              <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4 mt-4">
              <View className='mr-2'> 
              <Entypo name="lock" size={20} color="#7F39A6"/>
              </View>
            <TextInput placeholder="Set password" secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#675F5F"
              className="flex-1 font-pixel"/>
              </View>

            <View className="flex-row items-center rounded-full border border-[#7F39A6] bg-[#E2BFF6] px-3 py-4 mt-4 mb-4">
            <View className='mr-2'> 
            <Entypo name="lock" size={20} color="#7F39A6"/>
            </View>
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#675F5F"
              className="flex-1 font-pixel"/>
              </View>

            <Pressable onPress={handleSubmit} className="rounded-full bg-[#CF8DF5] border border-[#543666] py-4"
              style={inputStyle}>
              <Text className="text-center font-pixel text-black">
                Sign Up
              </Text> 
            </Pressable>
            <Text className=" font-pixel text-base text-center text-[#675F5F] mt-3 mb-3">Or</Text>
        
            <Pressable onPress={handleGoogle} className="rounded-full bg-[#E2BFF6] border border-[#543666] py-3 "
              style={inputStyle}>
                <View className="flex-row items-center px-4 justify-content">
                  <Image source={require('../assets/images/google.png')} style={{ width: 18, height: 24 }} resizeMode="contain"/>
              <Text className=" flex-1 text-center font-pixel text-black ">
                Google
              </Text> 
              </View>
            </Pressable>
            </View>

        )}
        </ScrollView>
        </KeyboardAvoidingView>
  </SafeAreaView>

  );

}