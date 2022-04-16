// ライブラリのインポート
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// コンポーネント(各画面)のインポート
import Home from './pages/home/Home.jsx';
import Login from './pages/login/login.jsx';
import Top from './pages/top/Top.jsx';

// CSSのインポート
import './style.css';

// ページを切り替えるコンポーネント
const App = () => {

    const [info, setInfo] = useState('');
    console.log(info)


    return(
        <BrowserRouter> 
        <Switch>
            <Route exact path='/'><Top value={"apple"} number={100} setInfo={setInfo} /></Route>
            <Route path='/login'><Login /></Route>
            <Route path='/home'><Home /></Route>
        </Switch>
        </BrowserRouter>
    ) 
}

render( 
    <App />
    , document.getElementById('app')
);