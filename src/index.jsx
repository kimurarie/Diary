// ライブラリーのインポート
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// コンポーネント(各画面)のインポート
import Home from './pages/home/Home.jsx';

// CSSのインポート
import './style.css';

render(
    // <BrowserRouter>
    //     <Switch>
    //         <Route exact path='/'><Home /></Route>
    //     </Switch>
    // </BrowserRouter>
    <h1 id="test">Hello,World!!</h1>
    ,
    document.getElementById('app')
);