import { useState, useEffect } from 'react';
import { database } from '../FirebaseConfig.js';
import { equalTo, getDatabase, orderByChild, query, ref, onValue, get } from 'firebase/database';
import Swal from 'sweetalert2';
{/* <script src="/js/sweetalert2.all.min.js"></script> */}

const Mypage = (props) => {

  const [mypostlist, setList] = useState('');

  // console.log(props.uid)
  // console.log(page)
  var id = props.uid;
  // console.log(id)

  // ブラウザバック防止
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', (e) => {
    history.go(1);
  });

  useEffect(() => { // 無限ループ対策

    const db = getDatabase();
    const recentPostsRef = query(ref(db, `posts/${props.experiment}`), orderByChild('id'), equalTo(props.uid));
    get(recentPostsRef).then((snapshot) => {
      let tmpList = [];
      var result = snapshot.val();
      // console.log(result);

      // resultのObjectのKeyをとり，その順番を裏返す
      const sortedKeys = Object.keys(result).reverse();

      for (let i = 0; sortedKeys[i]; i++) {
        // console.log(sortedKeys[i])
        // console.log(result[sortedKeys[i]])

        // 投稿内容をリストにpush
        tmpList.push(
        <div className='content_mypage' key={sortedKeys[i]}>
          <div className='header'>
            <p className='name'>{result[sortedKeys[i]].name}</p>
            <p className='created'>{result[sortedKeys[i]].created}</p>
            <div className='replies'>
              <p className='reply_counts'><i className="fas fa-comment-dots"></i>{props.comments}</p>
            </div>
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
  }, [])

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <h3 className="login-user">ログインユーザ：{props.name}さん</h3>
      <div className='button_home'>
      <button className={"btn-back"} onClick={() => props.setPage('home')}>ホームへ</button>
      </div>
      {mypostlist}
    </div>
  );
}

export default Mypage; // 外部から呼び出せるようにする