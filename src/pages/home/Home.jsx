import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set, onValue, push } from 'firebase/database';
import { getAuth, signOut, useDeviceLanguage } from 'firebase/auth';
import { Redirect } from 'react-router';
import { async } from '@firebase/util';

<script src="src/sweetalert2.all.min.js"></script>

const Home = (props) => {

  const [text, setText] = useState('');
  const [list, setList] = useState('');
  const [jump, setJump] = useState(false);

  console.log(props.name)
  // console.log(result)

  useEffect(() => { // 無限ループ対策
    onValue(ref(database, 'posts'), (snapshop) => {
      let tmpList = [];
      const result = snapshop.val()
      for (let i in result) {
        tmpList.push(<div className='content' key={i}><div className='header'><p className='name'>{result[i].name}</p><p className='created'>{result[i].created}</p></div><p className='post'>{result[i].text}</p>
          <button type="submit" className="btn-reply" onClick={() => reply()}><i className="fas fa-comment-alt"></i>返信</button></div>
        )
      }
      setList([...tmpList])
    })
  }, [])

  // DBから投稿IDを取得
  const getDb = () => {
    return new Promise(resolve => {
      const deRef = ref(getDatabase());
      get(child(deRef, '/posts/' + id)).then((snapshot) => {

        const result = snapshot.val();
        if (result === null)
          resolve('');
        else
          console.log(result)
        resolve(result.name);
      })
    })
  }

  const post = () => { // 投稿内容をDBに書き込み
    Swal.fire({
      title: '今日の日記',
      html: `<h3>今日の出来事</h3><textarea id="event" class="swal2-input"></textarea>
      <h3>その時感じたこと</h3><textarea id="thoughts" class="swal2-input"></textarea>
      <h3>そう感じた理由として考えられる自分の性格</h3><textarea id="personality" class="swal2-input"></textarea>`,
      confirmButtonText: '投稿する',
      focusConfirm: false,
      preConfirm: () => {
        const event = Swal.getPopup().querySelector('#event').value
        const thoughts = Swal.getPopup().querySelector('#thoughts').value
        const personality = Swal.getPopup().querySelector('#personality').value

        if (!event || !thoughts || !personality) {
          Swal.showValidationMessage(`全ての項目を入力してください`)
        }
        return { event: event, thoughts: thoughts, personality: personality }
      }
    }).then((result) => {
      const created = new Date();
      const timestamp = created.getFullYear() + "/" + (created.getMonth() + 1).toString().padStart(2, "0") + "/" + created.getDate().toString().padStart(2, "0")
        + " " + created.getHours().toString().padStart(2, "0") + ":" + created.getMinutes().toString().padStart(2, "0") + ":" + created.getSeconds().toString().padStart(2, "0");
      console.log(timestamp);

      // DBに登録
      push(ref(database, 'posts'), {
        created: timestamp,
        id: props.uid,
        name: props.name,
        event: result.value.event,
        thoughts: result.value.thoughts,
        personality: result.value.personality
      })
      Swal.fire({
        text: "投稿しました！",
        icon: "success",
      });
    })
  }

  //   // テキストが入力された場合
  //   if (text.length != 0) {
  //     // const created = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
  //     // console.log(created);
  //     // const timestamp = created.getMonth() + "年";
  //     // console.log(timestamp);
  //     const created = new Date(); // 現在の日付からDateオブジェクト作成
  //     const timestamp = created.getFullYear() + "/" + (created.getMonth() + 1).toString().padStart(2, "0") + "/" + created.getDate().toString().padStart(2, "0")
  //       + " " + created.getHours().toString().padStart(2, "0") + ":" + created.getMinutes().toString().padStart(2, "0") + ":" + created.getSeconds().toString().padStart(2, "0");
  //     console.log(timestamp);
  //     push(ref(database, 'posts'), {
  //       created: timestamp,
  //       text: text,
  //       id: props.uid,
  //       name: props.name,
  //     })
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       text: "テキストを入力してください",
  //     });
  //   }
  //   setText('');

  const test = async () => {

    console.log(await test2());

  }

  const test2 = () => {
    return new Promise(resolve => {
      console.log("OK")
      const db = getDatabase();
      const recentPostsRef = query(ref(db, 'replies'), orderByChild('pkey'), equalTo('-N3x5RvwMAOEJraqhBx1'));
      // const recentPostsRef =  child(ref(db), '/replies/-abc')

      get(recentPostsRef).then((snapshot) => {

        const result = snapshot.val();
        resolve(result);
      })
    })
  }

  const reply = () => {
    push(ref(database, 'replies'), {
      created: timestamp,
      text: text,
      id: props.uid,
      name: props.name,
      // pkey: 
    })

    // Swal.fire({
    //   title: "リフレーミングをしよう！",
    //   confirmButtonText: '返信する',
    //   showCloseButton: true,
    //   input: "textarea",
    //   footer: '<a href="http://www2.gsn.ed.jp/houkoku/2011c/11c31/siryo/reframing.pdf" target="_blank">リフレーミングに困ったときはこちら</a>',
    //   preConfirm: () => {
    //     const login = Swal.getPopup().querySelector('#login').value
    //     const password = Swal.getPopup().querySelector('#password').value
    //     if (!login || !password) {
    //       Swal.showValidationMessage(`Please enter login and password`)
    //     }
    //     return { login: login, password: password }
    //   }
    // }).then((result) => {
    //   Swal.fire(`
    //     Login: ${result.value.login}
    //     Password: ${result.value.password}
    //   `.trim())
    // })
  }

  // ログアウト処理
  const logout = () => {
    Swal.fire({
      icon: "warning",
      text: "ログアウトしますか？",
      confirmButtonText: 'ログアウト',
      showCancelButton: true,
      cancelButtonText: 'やめる',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: "ログアウトしました！",
          icon: "success",
        });
        const auth = getAuth();
        signOut(auth).then(() => {
          setJump(true);
          console.log(jump)
        });
      }
    });
  }

  if (jump) {
    return <Redirect to="/" />
  }

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <h3 className="login-user">ログインユーザ：{props.name}さん</h3>
      {/* <textarea value={text} className="textarea" onChange={(e) => setText(e.target.value)}></textarea> */}
      <button className={"btn-post"} onClick={() => post()}>投稿</button>
      {/* <button className={""} onClick={() => mypage()}>マイページ</button> */}
      <button className={"btn-logout"} onClick={() => logout()}>ログアウト</button>
      <button className={"btn-test"} onClick={() => test()}>テスト</button>
      {list}
    </div>
  );
}

export default Home; // 外部から呼び出せるようにする