import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set } from 'firebase/database';
import { Redirect } from 'react-router-dom';


const Login = () => {

  const [page, setPage] = useState('login');
  const [jump, setJump] = useState(false);
  const [nickname, setName] = useState('');
  const [uid, setId] = useState('');

  useEffect(async () => {
    const data = await getInfo();
    const id =  data.uid;
    const name = await getDb(id);
    setId(id);
    if (name === '') {
      setPage('singup');
    } else {
      setJump(true);
    }

  }, [])

  const getInfo = () => {
    return new Promise(resolve => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    })
  }

  const getDb = (id) => {
    return new Promise(resolve => {
      const deRef = ref(getDatabase());
      get(child(deRef, '/user/' + id)).then((snapshot) => {

        const result = snapshot.val();
        if (result === null)
          resolve('');
        else
          resolve(result.name);
      })
    })
  }

  const signUp = () => {
    const dbRef = ref(getDatabase(),'/user/'+uid);
    set(dbRef,{
      name:nickname
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