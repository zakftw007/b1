import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Pressable, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // To store custom error messages
    const router = useRouter();

    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);
        setErrorMessage('');  // Reset error message before trying
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            router.push('/home');
        } catch (error) {
            setLoading(false);
            // Handle specific Firebase errors and set custom error message
            if ((error as any).code === 'auth/invalid-email' || (error as any).code === 'auth/invalid-credential') {
                setErrorMessage('Username or password is incorrect');
            } else {
                // const firebaseErrorMessage = (error as any).message || 'An unknown error occurred';
                // setErrorMessage(firebaseErrorMessage);
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <ScrollView className="flex-1 bg-[#121212] px-6" style={{ paddingTop: 115 }}>
            {/* Header */}
            <View className="w-full justify-center items-center mb-12">
                <Text className="text-3xl text-[#E0E0E0] font-JakartaBold tracking-tight">Welcome Back</Text>
                <Text className="text-[#A0A0A0] mt-2">Sign in to continue.</Text>
            </View>

            {/* Error Message */}
            {errorMessage ? (
                <View className="bg-[#DC2626] p-4 mb-6 rounded-xl">
                    <Text className="text-white text-center">{errorMessage}</Text>
                </View>
            ) : null}

            {/* Form Fields */}
            <View>
                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    rules={{ required: 'Email is required' }}
                    render={({ field: { onChange, value } }) => (
                        <View className="bg-[#1E1E1E] rounded-xl mb-6">
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#555"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="text-[#E0E0E0] py-4 px-5 font-JakartaRegular"
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.email && <Text className="text-red-500 text-sm ml-5 mt-[-8] mb-2">{errors.email.message}</Text>}
                        </View>
                    )}
                />

                {/* Password */}
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, value } }) => (
                        <View className="relative bg-[#1E1E1E] rounded-xl mb-6">
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#555"
                                secureTextEntry={!showPassword}
                                textContentType="password"
                                className="text-[#E0E0E0] py-4 pl-5 pr-12 font-JakartaRegular"
                                value={value}
                                onChangeText={onChange}
                            />
                            <Pressable onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                            </Pressable>
                            {errors.password && <Text className="text-red-500 text-sm ml-5 mt-[-8] mb-2">{errors.password.message}</Text>}
                        </View>
                    )}
                />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-[#2E8C89] mt-8 py-4 rounded-xl items-center shadow-md" disabled={loading}>
                {loading ? <ActivityIndicator color="#F5F5F5" /> : <Text className="text-[#F5F5F5] text-lg font-JakartaSemiBold">Sign In</Text>}
            </TouchableOpacity>

            {/* Don't have an account? */}
            <View className="mt-6 items-center">
                <Text className="text-[#A0A0A0] font-JakartaRegular">
                    Don't have an account?{' '}
                    <Text
                        className="text-[#2E8C89] font-JakartaSemiBold"
                        onPress={() => router.replace('/signUp')}
                    >
                        Sign up
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export default SignIn;
