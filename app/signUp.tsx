import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Pressable, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@firebase'; // Relative path from (tabs)/signUp.tsx to budget/firebase.js
import { createUserWithEmailAndPassword } from 'firebase/auth';

interface SignUpFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUp = () => {
    const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: SignUpFormData) => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

            router.push('/home');
        } catch (error) {
            console.error('Error signing up:', (error as any).message);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
            Alert.alert('Sign Up Error', errorMessage);  // Show error to user
        }
    };

    return (
        <ScrollView className="flex-1 bg-[#121212] px-6" style={{ paddingTop: 115 }}>
            {/* Header */}
            <View className="w-full justify-center items-center mb-12">
                <Text className="text-3xl text-[#E0E0E0] font-JakartaBold tracking-tight">Create Account</Text>
                <Text className="text-[#A0A0A0] mt-2">Let's get you started.</Text>
            </View>

            {/* Form Fields */}
            <View>
                {/* Full Name */}
                <Controller
                    control={control}
                    name="fullName"
                    rules={{ required: 'Full name is required' }}
                    render={({ field: { onChange, value } }) => (
                        <View className="bg-[#1E1E1E] rounded-xl mb-6">
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#555"
                                className="text-[#E0E0E0] py-4 px-5 font-JakartaRegular"
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.fullName && <Text className="text-red-500 text-sm ml-5 mt-[-8] mb-2">{errors.fullName.message}</Text>}
                        </View>
                    )}
                />

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

                {/* Confirm Password */}
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Confirm your password',
                        validate: value => value === watch('password') || 'Passwords do not match',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <View className="relative bg-[#1E1E1E] rounded-xl mb-8">
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#555"
                                secureTextEntry={!showConfirmPassword}
                                textContentType="password"
                                className="text-[#E0E0E0] py-4 pl-5 pr-12 font-JakartaRegular"
                                value={value}
                                onChangeText={onChange}
                            />
                            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                            </Pressable>
                            {errors.confirmPassword && <Text className="text-red-500 text-sm ml-5 mt-[-8] mb-2">{errors.confirmPassword.message}</Text>}
                        </View>
                    )}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-[#2E8C89] mt-8 py-4 rounded-xl items-center shadow-md">
                <Text className="text-[#F5F5F5] text-lg font-JakartaSemiBold">Sign Up</Text>
            </TouchableOpacity>

            {/* Already have an account? */}
            <View className="mt-6 items-center">
                <Text className="text-[#A0A0A0] font-JakartaRegular">
                    Already have an account?{' '}
                    <Text className="text-[#2E8C89] font-JakartaSemiBold" onPress={() => router.replace('/signIn')}>
                        Sign in
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
};

export default SignUp;
