import { useState, useEffect } from 'react';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithRedirect } from 'firebase/auth';

const Top = () => {

  const login = () => {
    history.replaceState(null, null, '/login');
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth,provider);
  };

  return (
    <div>
      <button onClick={() => login()}>Googleで新規登録</button>
      <button onClick={() => login()}>Googleでログイン</button>
    </div>
  );
}

export default Top; // 外部から呼び出せるようにする