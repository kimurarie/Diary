import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { onValue, ref, push } from 'firebase/database';
import { getAuth, signOut, useDeviceLanguage } from 'firebase/auth';
import { Redirect } from 'react-router';

const Home = (props) => {

  const [text, setText] = useState('');
  const [list, setList] = useState('');
  const [jump, setJump] = useState(false);

  console.log(props.name)

  useEffect(() => { // 無限ループ対策
    onValue(ref(database, 'posts'), (snapshop) => {
      let tmpList = [];
      const result = snapshop.val()
      for (let i in result) {
        tmpList.push(<div key={i}><p>{result[i].name}</p><p>{result[i].text}</p></div>)
      }
      setList([...tmpList])
    })
  }, [])

  const post = () => { // 投稿内容をDBに書き込み
    push(ref(database, 'posts'), {
      text: text,
      id: props.uid,
      name: props.name
    })
    setText('');
  }

  const mypage = () => {
  }

  // ログアウト処理
  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setJump(true);
      console.log(jump)
    });
  }

  if (jump) {
    return <Redirect to="/" />
  }

  return (
    <div>
      {list}
      <input type="text" value={text} className="textbox" onChange={(e) => setText(e.target.value)}></input>
      <button className={"btn"} onClick={() => post()}>投稿</button>
      {/* <button className={""} onClick={() => mypage()}>マイページ</button> */}
      <button className={""} onClick={() => logout()}>ログアウト</button>
    </div>
  );
}

export default Home; // 外部から呼び出せるようにする