import { useState, useEffect } from 'react';
import firebase from '../FirebaseConfig.js'

const Top = () => {

  const login = () => {
    history.replaceState(null, null, '/login');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  return (
    <div>
      <button onClick={() => login()}>Googleで新規登録</button>
      <button onClick={() => login()}>Googleでログイン</button>
    </div>
  );
}

export default Top; // 外部から呼び出せるようにする