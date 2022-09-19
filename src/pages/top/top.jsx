import { useState, useEffect } from 'react';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithRedirect } from 'firebase/auth';

const Top = () => {

  // ブラウザバック防止
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', (e) => {
    history.go(1);
  });

  const login = () => {
    history.replaceState(null, null, '/login');
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <div className='button'>
      <button className="btn btn-signup" onClick={() => login()}>新しいアカウントを作成</button>
      <button className="btn btn-login" onClick={() => login()}>Googleでログイン</button>
      </div>
    </div>
  );
}

export default Top; // 外部から呼び出せるようにする