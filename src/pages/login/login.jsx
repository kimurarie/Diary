import { useState, useEffect } from 'react';
import firebase from '../FirebaseConfig.js'


const Login = () => {

  const [info, setInfo] = useState('');

  const getAuth = () => {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        resolve(user);
      })
    })
  }

  useEffect(async() => {
    console.log((await getAuth()));
  }, [])

  return (
    <div>
      ログイン
    </div>
  );
}

export default Login; // 外部から呼び出せるようにする