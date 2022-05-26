import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { onValue, ref, push } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';
import { Redirect } from 'react-router';

const Home = () => {

  const [text, setText] = useState('');
  const [list, setList] = useState('');
  const [jump, setJump] = useState(false);

  useEffect(() => { // 無限ループ対策
    onValue(ref(database, 'posts'), (snapshop) => {
      let tmpList = [];
      const result = snapshop.val()
      for (let i in result) {
        tmpList.push(<p key={i}>{result[i].text}</p>)
      }
      setList([...tmpList])
    })
  }, [])

  const post = () => { // 投稿内容をDBに書き込み
    push(ref(database, 'posts'), {
      text: text
    })
    setText('');
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
      <input type="text" value={text} onChange={(e) => setText(e.target.value)}></input>
      <button onClick={() => post()}>投稿</button>
      <button onClick={() => logout()}>ログアウト</button>
    </div>
  );
}

export default Home; // 外部から呼び出せるようにする