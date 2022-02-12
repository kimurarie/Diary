import { useState } from 'react';

const Home = () => {

  const [text, setText] = useState('');

  return (
    <div>
      <h1 id="test">{text}</h1>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)}></input>
    </div>
  );
}

export default Home; // 外部から呼び出す