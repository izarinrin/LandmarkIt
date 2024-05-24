import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import Header from '../components/header/PageHeader'
import { globalStyles } from '../styles/global'
import { Button, TextInput } from 'react-native-paper'
import TodoListItem from '../components/TodoListItem'
import { database } from '../firebase/app/firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'


const TodoScreen = ({ title }) => {


  const [todo, setTodo] = useState("")
  const [list, setList] = useState([
  ])
  const [updateId, setUpdateId] = useState()


  useEffect(() => {
    getTodos()
  }, [])


  const getTodos = () => {
    // once (read data once)
    // on (read data real time)
    database.ref('todo').on('value', (snapshot) => {
      var dataArray = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        dataArray.push(childData);
      });
      dataArray.reverse(); //to make it descending
      setList(dataArray)
    }, err => {
      console.log({ err });
    })
  }


  const onAdd = () => {
    const id = new Date().getTime()
    database.ref('todo/' + id).set({ id: id, todo, todo })
      .then(
        res => {
          setTodo('')
        },
        err => {
          console.log({ err });
        }
      );
  }


  const onUpdate = (item) => {
    let updates = {};
    updates['todo/' + item.id] = item;
    database.ref().update(updates,
      (completed) => {
        // todo after completed
      })
  }


  const onDelete = (item) => {
    let ref = database.ref(`todo/${item.id}`)
    ref.remove((completed) => {
      // todo after completed
    });
  }


  const renderItem = (itemData) => {
    return <TodoListItem item={itemData.item} showUpdate={itemData.item.id == updateId}
      onDelete={onDelete} setUpdateId={setUpdateId} onUpdate={onUpdate} />
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Header title={title ? title : "Todo"} noBack /> */}
      <ScrollView>
        <View style={[globalStyles.screenPadding]}>
          <View style={[globalStyles.flexRow, globalStyles.alignEnd]}>
            <TextInput
              mode={'outlined'}
              label={'Todo'}
              dense
              value={todo}
              onChangeText={setTodo}
              style={[globalStyles.mr10, { flexGrow: 1 }]} />
            <View >
              <Button mode="contained" onPress={() => { onAdd() }} >
                Add
              </Button>
            </View>
          </View>
          <View style={[globalStyles.mt20]}>
            <Text>Todo Lists:</Text>
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={item => item.id} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default TodoScreen


const styles = StyleSheet.create({


})
