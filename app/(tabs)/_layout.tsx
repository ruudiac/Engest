import { Tabs } from 'expo-router';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

// The active tab's icon sits in a framed "slot", like a game inventory
function Slot({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <View
      className={`w-12 h-9 items-center justify-center ${focused ? 'bg-[#F3DEFF] border-2 border-[#543666]' : ''}`}
    >
      {children}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#543666',
        tabBarInactiveTintColor: '#A88BBB',
        tabBarStyle: {
          backgroundColor: '#E2BFF6',
          borderTopWidth: 2,
          borderTopColor: '#543666',
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: 'PixelifySans', fontSize: 11, marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Slot focused={focused}><Entypo name="home" size={22} color={color} /></Slot>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <Slot focused={focused}><MaterialIcons name="leaderboard" size={22} color={color} /></Slot>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <Slot focused={focused}><AntDesign name="shop" size={22} color={color} /></Slot>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Slot focused={focused}><AntDesign name="smile" size={22} color={color} /></Slot>
          ),
        }}
      />
    </Tabs>
  );
}