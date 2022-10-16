import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set } from 'firebase/database';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

{/* <script src="/js/sweetalert2.all.min.js"></script> */}

const Login = (props) => {

  const experimentType = {
    experiment1: '実験1',
    experiment2: '実験2'
  }

  // propsで渡された値をprops名で使えるようにする
  // const {name,uid} = props;

  const [page, setPage] = useState('login');
  const [jump, setJump] = useState(false);
  const [nickname, setName] = useState('');
  const [experiment, setExperiment] = useState('');

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

  // 選択されたラジオボタンのvalueをセット
  const handleChange = e => setExperiment(e.target.value);

  // 新規登録でニックネームを登録
  const signUp = () => {
    if (experiment == '') {
      if(nickname.length == 0) {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#58a4ec",
        text: "全ての項目を入力してください",
      })
      }else{
        Swal.fire({
          icon: "warning",
          confirmButtonColor: "#58a4ec",
          text: "参加する実験を選択してください",
        })
      }
    }else if(experiment != '' && nickname.length == 0){
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#58a4ec",
        text: "ニックネームを入力してください",
      })
    }else {
      Swal.fire({
        title: '以下の内容で新規登録しますか？',
        html: 'ニックネーム：' + nickname + '<br>参加する実験：' + experimentType[experiment],
        confirmButtonText: '新規登録',
        confirmButtonColor: "#58a4ec",
        showCancelButton: true,
        cancelButtonText: 'やめる',
      }).then((result) => {
        if (result.isConfirmed) {

          // ニックネームをDBに登録
          const dbRef = ref(getDatabase(), '/user/' + props.uid);
          set(dbRef, {
            name: nickname,
            experiment: experiment
          })
          setJump(true);
          props.load();
          Swal.fire({
            icon: "success",
            confirmButtonColor: "#58a4ec",
            text: "新規登録が完了しました！",
          });
        }
      })
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
        <div className='form'>
          <div class="area_form">
            <div className='area_nickname'>
              <p className='form_title'><label htmlFor="nickname">ニックネーム</label></p>
              <input type="text" value={nickname} id="nickname" className="textbox" placeholder="" onChange={(e) => setName(e.target.value)}></input>
            </div>
            <div className='area_experiment'>
              <p className='form_title'>参加する実験</p>
              <div className='area_radio'>
                <div>
                  <label><input type="radio" name="experiment" value="experiment1" id="experiment" onChange={handleChange} checked={experiment === 'experiment1'}/>実験1：自分自身にリフレーミングをする</label>
                </div>
                <div>
                  <label><input type="radio" name="experiment" value="experiment2" id="experiment" onChange={handleChange} checked={experiment === 'experiment2'}/>実験2：第三者にリフレーミングをする</label>
                </div>
              </div>
            </div>
          </div>
          <button className="signup" onClick={() => signUp()}>新規登録</button>
        </div>
      </div>
    );
  }
}

export default Login; // 外部から呼び出せるようにする