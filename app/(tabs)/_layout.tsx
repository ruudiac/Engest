import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: '#EAD4F6',
        borderTopColor: '#EAD4F6',
      },
      headerShown: false,
    }}>
      <Tabs.Screen 
      name="dashboard"
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, 
         }) => (
          <Entypo name="home" size={24} color="#7F39A6" />)
      }} />
      <Tabs.Screen name="leaderboard" 
      options={{
        tabBarLabel: "Leaderboard",
        tabBarIcon: ({ color, 
         }) => (
          <MaterialIcons name="leaderboard" size={24} color="#7F39A6" />)
      }} />
      <Tabs.Screen name="shop"
      options={{
        tabBarLabel: "Shop",
        tabBarIcon: ({ color, 
         }) => (
          <AntDesign name="shop" size={24} color="#7F39A6" />)
      }}
       />
      <Tabs.Screen name="profile"
           options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, 
             }) => (
              <AntDesign name="smile" size={24} color="#7F39A6" />)
          }} />
    </Tabs>
  );
}