// ライブラリのインポート
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { equalTo, getDatabase, orderByChild, query, ref, get, child, set } from 'firebase/database';

// コンポーネント(各画面)のインポート
import Home from './pages/home/Home.jsx';
import Login from './pages/login/login.jsx';
import Top from './pages/top/Top.jsx';

// CSSのインポート
import './style.css';

// ページを切り替えるコンポーネント
const App = () => {

    const [uid, setId] = useState('');
    const [nickname, setName] = useState('ニックネームの初期値');

    // ブラウザバック防止
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', (e) => {
        history.go(1);
    });

    useEffect(async () => {
        const data = await getInfo();

        // ログイン時(dataが存在した時)
        if (data != null) {
            const id = data.uid;
            setId(id);
            const name = await getDb(id);
            setName(name);
        }

    }, [])

    // ログインユーザの情報を取得，未ログイン時はnullを返す
    const getInfo = () => {
        return new Promise(resolve => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                resolve(user);
            });
        })
    }

    // DBからニックネームを取得
    const getDb = (id) => {
        return new Promise(resolve => {
            const deRef = ref(getDatabase());
            get(child(deRef, '/user/' + id)).then((snapshot) => {

                const result = snapshot.val();
                if (result === null)
                    resolve('');
                else
                    // console.log(result)
                    resolve(result.name);
            })
        })
    }

    return (
        // 子コンポーネントにpropsを渡す
        <BrowserRouter>
            <Switch>
                <Route exact path='/'><Top /></Route>
                <Route path='/login'>{nickname === 'ニックネームの初期値' ? null : <Login uid={uid} name={nickname} />}</Route>
                <Route path='/home'><Home uid={uid} name={nickname} /></Route>
            </Switch>
        </BrowserRouter>
    )
}

render(
    <App />
    , document.getElementById('app')
);