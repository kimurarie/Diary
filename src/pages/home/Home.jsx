import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { onValue, ref, push } from 'firebase/database';
import { getAuth, signOut, useDeviceLanguage } from 'firebase/auth';
import { Redirect } from 'react-router';

<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js"></script>

const Home = (props) => {

  const [text, setText] = useState('');
  const [list, setList] = useState('');
  const [jump, setJump] = useState(false);

  console.log(props.name)

  useEffect(() => { // 無限ループ対策
    onValue(ref(database, 'posts'), (snapshop) => {
      let tmpList = [];
      const result = snapshop.val()
      for (let i in result) {
        tmpList.push(<div className='content' key={i}><div className='header'><p className='name'>{result[i].name}</p><p className='created'>{result[i].created}</p></div><p className='post'>{result[i].text}</p>
          <button type="submit" className="btn-reply" onClick={() => reply()}><i class="fas fa-comment-alt"></i>返信</button></div>
        )
      }
      setList([...tmpList])
    })
  }, [])

  const post = () => { // 投稿内容をDBに書き込み

    // テキストが入力された場合
    if (text.length != 0) {
      // const created = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
      // console.log(created);
      // const timestamp = created.getMonth() + "年";
      // console.log(timestamp);
      const created = new Date(); // 現在の日付からDateオブジェクト作成
      const timestamp = created.getFullYear() + "/" + (created.getMonth() + 1).toString().padStart(2, "0") + "/" + created.getDate().toString().padStart(2, "0")
        + " " + created.getHours().toString().padStart(2, "0") + ":" + created.getMinutes().toString().padStart(2, "0") + ":" + created.getSeconds().toString().padStart(2, "0");
      console.log(timestamp);
      push(ref(database, 'posts'), {
        created: timestamp,
        text: text,
        id: props.uid,
        name: props.name,
      })
    } else {
      swal({
        icon: "warning",
        text: "テキストを入力してください",
      });
    }
    setText('');
  }

  const reply = () => {
    swal({
      title: "リフレーミングをしよう",
      button: "投稿する",
      content: {
        element: "input",
        attributes: {
          // placeholder: "Type your password",

        },
      },
    });
  }

  // ログアウト処理
  const logout = () => {
    swal({
      icon: "warning",
      text: "ログアウトしますか？",
      buttons: {
        cancel: "キャンセル",
        defeat: "ログアウト"
      },
    })
      .then(() => {
        switch (value) {
          case "defeat":
            swal({
              text: "ログアウトしました！",
              icon: "success",
            });
            const auth = getAuth();
            signOut(auth).then(() => {
              setJump(true);
              console.log(jump)
            });
            break;
          default:
        }
      });
  }

    // Swal.fire({
    //   icon: "warning",
    //   title: 'ログアウトしますか？',
    //   showCancelButton: true,
    //   confirmButtonText: 'ログアウト',
    //   cancelButtonText: 'キャンセル'
    // }).then((result) => {
    //   if (result.value) {
    //     const auth = getAuth();
    //     signOut(auth).then(() => {
    //       setJump(true);
    //       console.log(jump)
    //     });
    //   }
    // });

  if (jump) {
    return <Redirect to="/" />
  }

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <textarea value={text} className="textarea" onChange={(e) => setText(e.target.value)}></textarea>
      <button className={"btn-post"} onClick={() => post()}>投稿</button>
      {/* <button className={""} onClick={() => mypage()}>マイページ</button> */}
      <button className={"btn-logout"} onClick={() => logout()}>ログアウト</button>
      {list}
    </div>
  );
}

export default Home; // 外部から呼び出せるようにする