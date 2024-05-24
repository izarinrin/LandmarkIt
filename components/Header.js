import {Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

const Header = ({ setScreenData }) => {
    const navigation = useNavigation()
    const Stack = createNativeStackNavigator();

    const currentUser = useSelector((state) => state.currentUser.value);

    const navigateReset = (name) => {
        navigation.reset({
            index: 0,
            routes: [{ name }],
        });
    }

    return (
        <View style={styles.headerMain}>
            <View>
                <Text style={styles.txtStyle}>Hi {currentUser.displayName} !</Text>
            </View>
            <View style={{ flex: 1, alignSelf: 'flex-end' }}>
                <Pressable
                    style={styles.pButton}
                    onPress={() => navigateReset('login-screen')}>
                    <Text>Log out</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    headerMain: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'grey',
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
    },
    txtStyle: {
        color: 'white',
        fontWeight: '600'
    },
    pButton: {
        // flex: 1,
        backgroundColor: 'white',
        padding: 5,
        width: '50%',
        minHeight: 30,
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
})