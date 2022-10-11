import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { theme } from './color';

const STORAGE_KEY = "@toDos"
const WORKING_SET = "@WorKings"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [workingCheck, setWorkingCHeck] = useState({});
  useEffect(() => {loadToDos();loadWorkCheck();}, []);
  useEffect(() => {addWorkCheck();},[working]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  // AsyncStorage 사용시 try catch 구문 사용하기 (사용자 폰의 용량이 없거나 하는 경우 대비)
  const saveWorks = async (working) => {
    await AsyncStorage.setItem( WORKING_SET, JSON.stringify(working));
  }

  const addWorkCheck = async() => {
    const newWorkCheck = Object.assign(
      {},
      workingCheck,
      {working}
    );
  
    await saveWorks(newWorkCheck);
  }
  const loadWorkCheck = async () => {
    const l = await AsyncStorage.getItem(WORKING_SET);
    setWorkingCHeck(JSON.parse(l));
  }
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem( STORAGE_KEY , JSON.stringify(toSave));
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  }
  const addToDo = async () => { 
    if(text === "") {
      return; 
    }
    // object assign을 이용한 todo 받아오기
    const newToDos = Object.assign(
      {},
      toDos,
      {[Date.now()] : {text, working}}
      )


    // es6 javascript를 이용한 todo 받아오기
    // const newToDos = {
    //   ...toDos, 
    //   [Date.now()]: {text, working}
    //   };


      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
  }

  const deleteToDo = async (key) => {
    Alert.alert("진짜 삭제하실거에여?", "진짜? 정말로?", [
      {text:"취소"},
      {text:"확인", onPress: async () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      } }
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnTxt, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
            <Text style={{...styles.btnTxt, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
      returnKeyType='done'
      onSubmitEditing={addToDo}
      onChangeText={onChangeText} 
      value={text} 
      placeholder={working ? "Add a To do" : "Where do you want go"} 
      style={styles.input}>       
      </TextInput>
      <ScrollView>{
        Object.keys(toDos).map((key) => 
          toDos[key].working === working ? (

            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}><Text><Fontisto name="trash" size={18} color={theme.grey} /></Text></TouchableOpacity>
            </View>

          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnTxt: {
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius : 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo : {
    backgroundColor: theme.toDoBg,
    marginBottom : 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText : {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  }
});
