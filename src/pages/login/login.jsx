import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const Login = () => {

  const [info, setInfo] = useState('');

  const get = () => {
    return new Promise(resolve => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        resolve(user);        
      });
    })
  }

  useEffect(async() => {
    // console.log((await get()));
  }, [])

  return (
    <div>
      ログイン
    </div>
  );
}

export default Login; // 外部から呼び出せるようにする