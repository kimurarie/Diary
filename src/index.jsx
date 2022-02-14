// ライブラリーのインポート
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// コンポーネント(各画面)のインポート
import Home from './pages/home/Home.jsx';

// CSSのインポート
import './style.css';

render( 
    // ページ遷移
    <BrowserRouter> 
        <Switch>
            <Route exact path='/'><Home /></Route>
        </Switch>
    </BrowserRouter>
    , document.getElementById('app')
);