import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { ref, onValue, push, update, getDatabase, set, query, orderByChild, get, equalTo} from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';
import { Redirect } from 'react-router';
import Swal from 'sweetalert2';

{/* <script src="/js/sweetalert2.all.min.js"></script> */}

const Post = (props) => {

  const [list, setList] = useState('');
  const [jump, setJump] = useState(false);

  // console.log(props.counts)
  // console.log(props.key)
  // console.log(comments)
  // console.log(props.uid)

  // ブラウザバック防止
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', (e) => {
    history.go(1);
  });


  useEffect(() => { // 無限ループ対策
    if(props.experiment=="experiment2"){
    onValue(ref(database, `posts/${props.experiment}`), (snapshop) => {
      let tmpList = [];
      const result = snapshop.val()

      // resultのObjectのKeyをとり，その順番を裏返す
      const sortedKeys = Object.keys(result).reverse();

      for (let i = 0; sortedKeys[i]; i++) {
        // console.log(sortedKeys[i])
        // console.log(result[sortedKeys[i]])

        // 投稿内容をリストにpush
        tmpList.push(
          <div className='content' key={sortedKeys[i]}>
            <div className='header' onClick={() => transition(result[sortedKeys[i]], sortedKeys[i])}>
              <p className='name'>{result[sortedKeys[i]].name}</p>
              <p className='created'>{result[sortedKeys[i]].created}</p>
              <div className='replies'>
                <p className='reply_counts'><i className="fas fa-comment-dots"></i>{result[sortedKeys[i]].comments}</p>
              </div>
            </div>
            <div className='posts'>
              <p className='post'>今日の出来事：{result[sortedKeys[i]].event}</p>
              <p className='post'>感じたこと：{result[sortedKeys[i]].thoughts}</p>
              <p className='post post-personality'>自分の性格：{result[sortedKeys[i]].personality}</p>
            </div>
            <div className='reply'>
              <button type="submit" className="btn-reply" onClick={() => reply(sortedKeys[i])}><i className="fas fa-comment-alt"></i>返信</button>
            </div>
          </div>
        )
      }
      setList([...tmpList])
    })
  }else{
    const db = getDatabase();
    const recentPostsRef = query(ref(db, `posts/${props.experiment}`), orderByChild('id'), equalTo(props.uid));
    get(recentPostsRef).then((snapshot) => {
      let tmpList = [];
      var result = snapshot.val();
      // console.log(`posts/${props.experiment}`);
      console.log(result);

      // resultのObjectのKeyをとり，その順番を裏返す
      const sortedKeys = Object.keys(result).reverse();

      for (let i = 0; sortedKeys[i]; i++) {
        // console.log(sortedKeys[i])
        // console.log(result[sortedKeys[i]])

        // 投稿内容をリストにpush
        tmpList.push(
        <div className='content_mypage' key={sortedKeys[i]}>
          <div className='header' onClick={() => transition(result[sortedKeys[i]], sortedKeys[i])}>
            <p className='name'>{result[sortedKeys[i]].name}</p>
            <p className='created'>{result[sortedKeys[i]].created}</p>
          </div>
          <div className='posts'>
            <p className='post'>今日の出来事：{result[sortedKeys[i]].event}</p>
            <p className='post'>感じたこと：{result[sortedKeys[i]].thoughts}</p>
            <p className='post post-personality'>自分の性格：{result[sortedKeys[i]].personality}</p>
          </div>
          <div className='reply'>
            <button type="submit" className="btn-reply" onClick={() => reply(sortedKeys[i])}>
              <i className="fas fa-comment-alt"></i>返信
            </button>
          </div>
        </div>
        )
      }
      setList([...tmpList])
    })  

  }
  }, [])

  // コンポーネントの切り替えの際に必要なstateを更新
  const transition = (post, key) => {
    props.setPost(post)
    props.setKey(key)
    props.setPage('reply')
  }

  const mypage = () => {
    props.setPage('mypage')
  }

  const post = () => { // 投稿内容をDBに書き込み
    Swal.fire({
      title: '今日の振り返りをしよう！',
      html: `<h3 className="form-title">今日の出来事</h3><textarea id="event" class="swal2-input"></textarea>
      <h3 className="form-title">その時感じたこと</h3><textarea id="thoughts" class="swal2-input"></textarea>
      <h3 className="form-title">そう感じた理由として考えられる自分の性格</h3><textarea id="personality" class="swal2-input"></textarea>`,
      confirmButtonText: '投稿する',
      confirmButtonColor: "#58a4ec",
      showCancelButton: true,
      cancelButtonText: 'やめる',
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const event = Swal.getPopup().querySelector('#event').value
        const thoughts = Swal.getPopup().querySelector('#thoughts').value
        const personality = Swal.getPopup().querySelector('#personality').value

        // 入力チェック
        if (!event || !thoughts || !personality) {
          Swal.showValidationMessage(`全ての項目を入力してください`)
        }
        return { event: event, thoughts: thoughts, personality: personality }
      }
    }).then((result) => {
      // タイムスタンプを取得
      const created = new Date();
      const timestamp = created.getFullYear() + "/" + (created.getMonth() + 1).toString().padStart(2, "0") + "/" + created.getDate().toString().padStart(2, "0")
        + " " + created.getHours().toString().padStart(2, "0") + ":" + created.getMinutes().toString().padStart(2, "0") + ":" + created.getSeconds().toString().padStart(2, "0");

      // DBに登録
      push(ref(database, `posts/${props.experiment}`), {
        created: timestamp,
        id: props.uid,
        name: props.name,
        event: result.value.event,
        thoughts: result.value.thoughts,
        personality: result.value.personality,
        comments: 0
      })
      Swal.fire({
        text: "投稿しました！",
        confirmButtonColor: "#58a4ec",
        icon: "success",
      });
    })
  }

  const reply = (key) => {
    Swal.fire({
      title: "リフレーミングをしよう！",
      html: `<textarea id="reply" class="swal2-input"></textarea>`,
      footer:`<a href=${window.location.origin}/reframing.pdf target="_blank"}>リフレーミングに困ったときはこちら</a>`,
      confirmButtonText: '返信する',
      confirmButtonColor: "#58a4ec",
      showCancelButton: true,
      cancelButtonText: 'やめる',
      allowOutsideClick: false,
      focusConfirm: false,
      preConfirm: () => {
        const reply = Swal.getPopup().querySelector('#reply').value

        // 入力チェック
        if (!reply) {
          Swal.showValidationMessage(`テキストを入力してください`)
        }
        return { reply: reply }
      }
    }).then((result) => {
      // タイムスタンプを取得
      const created = new Date();
      const timestamp = created.getFullYear() + "/" + (created.getMonth() + 1).toString().padStart(2, "0") + "/" + created.getDate().toString().padStart(2, "0")
        + " " + created.getHours().toString().padStart(2, "0") + ":" + created.getMinutes().toString().padStart(2, "0") + ":" + created.getSeconds().toString().padStart(2, "0");

      // DBに登録(replies)
      push(ref(database, 'replies'), {
        created: timestamp,
        id: props.uid,
        name: props.name,
        reply: result.value.reply,
        pkey: key
      })

      // 該当する投稿のコメント数を取得
      const db = getDatabase();
      const recentPostsRef = query(ref(db, `posts/${props.experiment}/` + key));
      get(recentPostsRef).then((snapshot) => {
        var result = snapshot.val();        
        //コメント数を+1
        const comments = result.comments +1;

        // DB更新(posts)
        const dbRef = ref(getDatabase(), `posts/${props.experiment}/` + key);
        update(dbRef, {
        comments: comments
        })
      })

      Swal.fire({
        text: "返信しました！",
        confirmButtonColor: "#58a4ec",
        icon: "success",
      });

    })
  }

  // ログアウト処理
  const logout = () => {
    Swal.fire({
      icon: "warning",
      text: "ログアウトしますか？",
      confirmButtonText: 'ログアウト',
      confirmButtonColor: "rgb(240, 103, 103)",
      showCancelButton: true,
      cancelButtonText: 'やめる',
      cancelButtonColor: '#',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: "ログアウトしました！",
          confirmButtonColor: "#58a4ec",
          icon: "success",
        });
        const auth = getAuth();
        signOut(auth).then(() => {
          setJump(true);
        });
      }
    });
  }

  // tureのとき，topへリダイレクト
  if (jump) {
    return <Redirect to="/" />
  }

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <h3 className="login-user">ログインユーザ：{props.name}さん</h3>
      <div className="manual">
        <a href={`${window.location.origin}/manual.pdf#zoom=50`} target="_blank">使い方</a>
      </div>
      <div className='button_home'>
        <button className={"btn-post"} onClick={() => post()}>投稿</button>
        <button className={"btn-mypage"} onClick={() => mypage()}>マイページ</button>
        <button className={"btn-logout"} onClick={() => logout()}>ログアウト</button>
      </div>
      {list}
    </div>
  );
}

export default Post; // 外部から呼び出せるようにする