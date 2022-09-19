import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set } from 'firebase/database';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

{/* <script src="/js/sweetalert2.all.min.js"></script> */}

const Login = (props) => {

  // propsで渡された値をprops名で使えるようにする
  // const {name,uid} = props;

  const [page, setPage] = useState('login');
  const [jump, setJump] = useState(false);
  const [nickname, setName] = useState('');

  // ブラウザバック防止
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', (e) => {
    history.go(1);
  });

  useEffect(() => {
    // nameが存在しなかったら新規登録画面へ
    if (props.name === '') {
      setPage('singup');
    } else {
      setJump(true);
    }
  }, [])

  // 新規登録でニックネームを登録
  const signUp = () => {
    if (nickname.length != 0) {
      Swal.fire({
        title: 'この名前で新規登録しますか？',
        text: 'ニックネーム：' + nickname,
        confirmButtonText: '新規登録',
        confirmButtonColor: "#58a4ec",
        showCancelButton: true,
        cancelButtonText: 'やめる',
      }).then((result) => {
        if (result.isConfirmed) {

          // ニックネームをDBに登録
          const dbRef = ref(getDatabase(), '/user/' + props.uid);
          set(dbRef, {
            name: nickname
          })
          setJump(true);
          Swal.fire({
            icon: "success",
            confirmButtonColor: "#58a4ec",
            text: "新規登録が完了しました！",
          });
        }
      })
    } else {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#58a4ec",
        text: "ニックネームを入力してください",
      });
    }
  }

  // tureのとき，homeへリダイレクト
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
      <div className="main">
        <h1 className="title">新規登録画面</h1>
        <div className='button'>
        <input type="text" value={nickname} id="nickname" className="textbox" placeholder="ニックネームを入力" onChange={(e) => setName(e.target.value)}></input>
        <button className="signup" onClick={() => signUp()}>新規登録</button>
        </div>
      </div>
    );
  }
}

export default Login; // 外部から呼び出せるようにする