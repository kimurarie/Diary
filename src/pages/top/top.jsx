import { useState, useEffect } from 'react';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithRedirect } from 'firebase/auth';

const Top = (props) => {

  const login = () => {
    history.replaceState(null, null, '/login');
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth,provider);
  };

  // console.log(props.number)

  return (
    <div>
      <button onClick={() => login()}>Googleで新規登録</button>
      <button onClick={() => login()}>Googleでログイン</button>
      {/* <button onClick={() => props.setInfo('木村理恵')}>テスト</button> */}
    </div>
  );
}

export default Top; // 外部から呼び出せるようにする