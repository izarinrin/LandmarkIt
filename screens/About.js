import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

const About = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{}}>
      <Header />
      <Text style={{textAlign:'center'}}>About</Text>
      <Button
        onPress={() => navigation.navigate('home-screen')}>
        Back
      </Button>
    </SafeAreaView>
  )
}

export default About

const styles = StyleSheet.create({})