import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set } from 'firebase/database';
import { Redirect } from 'react-router-dom';

const Login = (props) => {

  // const {name,uid} = props;

  const [page, setPage] = useState('login');
  const [jump, setJump] = useState(false);
  const [nickname, setName] = useState('');
  
  console.log(props.name,props.uid)

  useEffect( () => {
    
    // setUid(props.id)
    // setId(id);

    if (props.name === '') {
      setPage('singup');
    } else {
      setJump(true);
    }

  }, [])

  // 新規登録でニックネームを登録
  const signUp = () => {
    const dbRef = ref(getDatabase(), '/user/' + props.uid);
    set(dbRef, {
      name: nickname
    })
    setJump(true);
  }

  if (jump) {
    return <Redirect to="/home" />
  }

  if (page === 'login') {
    return (
      <div>
        loading...
      </div>
    );
  } else {
    return (
      <div>
        新規登録
        <input type="text" value={nickname} onChange={(e) => setName(e.target.value)}></input>
        <button onClick={() => signUp()}>新規登録</button>
      </div>
    );
  }
}

export default Login; // 外部から呼び出せるようにする