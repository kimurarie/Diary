// ライブラリーのインポート
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// コンポーネント(各画面)のインポート
import Home from './pages/home/Home.jsx';
import Login from './pages/login/login.jsx';
import Top from './pages/top/top.jsx';

// CSSのインポート
import './style.css';

// ページを切り替えるコンポーネント
const App = () => {

    const [info, setInfo] = useState('');

    return(
        <BrowserRouter> 
        <Switch>
            <Route exact path='/'><Top /></Route>
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