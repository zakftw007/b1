import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@firebase';
import { ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DonutLargeIcon from 'C:\\Users\\mouto\\OneDrive\\Desktop\\app1\\budget\\assets\\donut_large.svg';
import Wallet from 'C:\\Users\\mouto\\OneDrive\\Desktop\\app1\\budget\\assets\\wallet.svg';

const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If user is not signed in, redirect to signIn page (outside tabs)
      if (!currentUser) {
        router.replace('/signIn');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#2E8C89" />
      </View>
    );
  }

  // If user is authenticated, show the tabs
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#3AAFA9',
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <DonutLargeIcon
              width={28}
              height={28}
              fill={color}
              opacity={focused ? 1 : 0.6}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Wallet
              width={28}
              height={28}
              fill={color}
              opacity={focused ? 1 : 0.6}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }: { color: string; focused: boolean }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color }: { color: string; focused: boolean }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
