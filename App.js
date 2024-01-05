<script src="http://localhost:8097"></script>

import React, { useState, useEffect	} from "react"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
	Platform,
}from "react-native"; 


const toDoApp = () => { 
	const [inputTask, setInputTask] = useState(""); 
	const [tasks, setTasks] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1);
	const [taskStatus , setTaskStatus] = useState([]);

	
	useEffect(() => {
		// アプリを起動させたときにローカルストレージからタスクを読み込む
		getData();
	}, []);
	
	const storeData = async (value) => {
    try {
		await  AsyncStorage.setItem("keyOfTasks", JSON.stringify(value));
		} catch (error) {
		console.log("Error storing data: ", error);
		}
	};
	
	const getData = async () => {
		try {
		const storedTasks = await AsyncStorage.getItem("keyOfTasks");
		if (storedTasks !== null) {
			setTasks(JSON.parse(storedTasks));
		}
		} catch (error) {
		console.log("Error retrieving data: ", error);
		}
	};


	const addTask = () => {
		if(inputTask){
			let updatedTasks
			//もし入力したタスクが無いなら
			if(editIndex === -1){
				updatedTasks = [...tasks, inputTask]
				setTasks(updatedTasks);
				setTaskStatus([...taskStatus, false]);
			}
			else {
				//そうでなければ(タスクが1つでもあるなら)
				const taskToUpdate = [...tasks]; 
                taskToUpdate[editIndex] = inputTask; 
				updatedTasks = taskToUpdate;
				setTasks(updatedTasks);
				setTaskStatus([...taskStatus, false]);
			}
			storeData(updatedTasks);
			setInputTask("");
		}
	};
	
	
	const editTask = (index) => {
		//編集したいタスクの値を取得
		const taskToEdit = tasks[index];
		//その値を編集した値で書き換え
		setInputTask(taskToEdit);
		//インデックスをセットする
		setEditIndex(index);
	};
	

	const deleteTask = (index) => {
		//タスクを全て取得
		const taskToDelete = [...tasks];
		//削除したいタスクをspliceで削除
		taskToDelete.splice(index, 1);
		//削除したタスクをセットする(反映させる)
		setTasks(taskToDelete);
		storeData(taskToDelete);
	}

	const doneTask = (index) => {
		const updatedStatus = [...taskStatus]; // 現在のタスクの完了or未完了状態をコピー
        updatedStatus[index] = !updatedStatus[index]; // 完了状態⇔未完了状態を切り替え
        setTaskStatus(updatedStatus); //状態を更新
	};

	/*タスク追加ボタンを三項演算子ではなくif文で変化させようとした残骸です
	const judgeAddButtonText = (editIndex) => {
	if(editIndex === -1){
		return("タスクを追加");
	}else{
		return("タスクを更新");
	};
	};
	*/
	


	/*OSの種類によって文を変えて表示させようとした残骸です
	const Platform = props => {
		return (
			<View>
				<Text>Hello,{platformName}!</Text>
			</View>
		)
	}

	const platformName = () => {
		return (
			Platform.select ({
				ios: {platform name ="ios"},
				android: {android},
				default: {web},
			})
		);
	};
	*/



	const renderItem = ({ item, index }) => (
			//<CheckBox value={taskStatus} onValueChange={() => doneTask(index)}/>
			/*上記は input type="checkbox" を CheckBox で実装しようとした残骸です。
			webでは動作は問題ありませんでしたが、iosだとエラーを吐いたので修正しようとしましたが期限内にできませんでした。
			大変申し訳ありません…*/

			//doneTaskが実行され、trueの場合、itemの色を"#ccc"にする
			<View style={styles.task}>
				<Checkbox  onChange={() => doneTask(index)}/>
				<Text style={[styles.itemList, { color: taskStatus[index] ? "#ccc" : "black" }]}>{item}</Text>
				<View style={styles.taskButtons}>
					<TouchableOpacity onPress={() => editTask(index)}>
						<Text style={styles.editButton}>編集</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => deleteTask(index)}>
						<Text style={styles.deleteButton}>削除</Text>
					</TouchableOpacity>
				</View>
			</View>
	);


	return(
	<View style={styles.container}>
		<Text style = {styles.title}>To Do App</Text>
		<TextInput 
			style = {styles.inputArea} 
			placeholder = "タスクを入力してください"
			value = {inputTask}
			onChangeText={(text) => setInputTask(text)}
		/>

		<TouchableOpacity style = {styles.addButton} onPress={addTask}>
			<Text style = {styles.addButtonText}>
				{editIndex === -1 ? "タスクを追加" : "タスクを更新"}
			</Text>
		</TouchableOpacity>

		<FlatList
			data = {tasks}
			renderItem={renderItem}
			keyExtractor={(item, index) => index.toString()}
		/>
	</View>
	);
};

const styles = StyleSheet.create({
	container: { 
        flex: 1, 
        padding: 40, 
        marginTop: 40, 
    }, 
    title: { 
        marginBottom: 20, 
        fontWeight: "bold", 
        fontSize: 24, 
		...Platform.select({
			ios: {
				color: "#87cefa",
			},
			android: {
				color: "#ffb6c1",
			},
			default: {
				color: "#00ff00",
			},
		}),
    }, 
    heading: { 
        color: "green", 
        marginBottom: 7, 
        fontWeight: "bold", 
        fontSize: 30, 
    }, 
    inputArea: { 
        borderWidth: 3, 
        borderColor: "#ccc", 
        padding: 10, 
        marginBottom: 10, 
        borderRadius: 10, 
        fontSize: 18, 
    }, 
    addButton: { 
        backgroundColor: "green", 
        padding: 10, 
        marginBottom: 10, 
        borderRadius: 5, 
    }, 
    addButtonText: { 
        color: "white", 
        fontWeight: "bold", 
        textAlign: "center", 
        fontSize: 18, 
    }, 
    task: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 15, 
        fontSize: 18, 
    }, 
    itemList: { 
        fontSize: 19, 
    }, 
    taskButtons: { 
        flexDirection: "row", 

    }, 
    editButton: { 
        marginRight: 10, 
		color: "white", 
		backgroundColor: "green",
		padding: 3,
		borderRadius: 5,	
        fontWeight: "bold", 
        fontSize: 18, 
    }, 
    deleteButton: { 
		color: "white", 
		backgroundColor: "red",
		padding: 3,
		borderRadius: 5,  
        fontWeight: "bold",
        fontSize: 18, 
    }, 
});

export default toDoApp;
