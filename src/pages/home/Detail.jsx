import { useState, useEffect } from 'react';
import { equalTo, getDatabase, orderByChild, query, ref, get } from 'firebase/database';
import Swal from 'sweetalert2';
{/* <script src="/js/sweetalert2.all.min.js"></script> */}

const Detail = (props) => {

  const [postlist, setList] = useState('');

  // console.log(props.pkey)

  // ブラウザバック防止
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', (e) => {
    history.go(1);
  });

  useEffect(() => { // 無限ループ対策

    // クリックされた投稿の表示
    let tmpList = [];
    tmpList.push(<div className='content_detail'><div className='header'><p className='name'>{props.post.name}</p><p className='created'>{props.post.created}</p></div>
      <div className='posts'><p className='post'>今日の出来事：{props.post.event}</p><p className='post'>感じたこと：{props.post.thoughts}</p><p className='post post-personality'>自分の性格：{props.post.personality}</p></div></div>
    )
    setList([...tmpList])

    // クリックされた投稿に対する返信を取得，表示
    const db = getDatabase();
    const recentPostsRef = query(ref(db, 'replies'), orderByChild('pkey'), equalTo(props.pkey));
    get(recentPostsRef).then((snapshot) => {
      var result = snapshot.val();
      // console.log(result);

      for (let i in result) {
        // console.log(result[i]);
        tmpList.push(<div className='content_reply' key={i}><div className='header'><p className='name'>{result[i].name}</p><p className='created'>{result[i].created}</p></div>
          <div className='posts'><p className='post'>{result[i].reply}</p></div></div>
        )
      }
      setList([...tmpList])
    })
  }, [])

  return (
    <div className="main">
      <h1 className="title">自己肯定感を高める日記帳システム</h1>
      <h3 className="login-user">ログインユーザ：{props.name}さん</h3>
      <div className='button'>
      <button className={"btn-back"} onClick={() => props.setPage('home')}>ホームへ</button>
      </div>
      {postlist}
    </div>
  );
}

export default Detail; // 外部から呼び出せるようにする