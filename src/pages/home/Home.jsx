import { useState, useEffect } from 'react';
import {
    ref, get, onValue, push, serverTimestamp
} from "firebase/database";

// Firebaseの設定ファイルのインポート
import { database } from "./../FirebaseConfig.js";

const Home = () => {
    const [text, setText] = useState('');
    const [list, setList] = useState([]);

    useEffect(() => {
        let tmpList = [...list];
        const dbRef = ref(database, 'posts');
        // onValue(dbRef, (snapshot) => {
        //     const result = snapshot.val();
        // });
        get(dbRef).then((snapshot) => {
            const result = snapshot.val();
            if (result !== null) {
                Object.keys(result).forEach(key => {
                    tmpList.push(<p key={key}>{result[key].text}</p>);
                });
                setList(tmpList);
                // const date = new Date(result.time)
            }
        })
    }, []);

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const post = (postText) => {
        push(ref(database, 'posts'), {
            text: postText,
            time: serverTimestamp()
        });
        setText('');
    }

    return (
        <div>
            <input type="text" id="message" placeholder="メッセージを入力" value={text} onChange={handleChange}></input>
            <button type="button" onClick={() => post(text)}>投稿</button>
            {list}
        </div>
    );
}

export default Home;