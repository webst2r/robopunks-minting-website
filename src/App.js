import { useState } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';

function App() {
  // Todas as contas de UMA carteira
  const [accounts, setAccounts] = useState([]);

  /* Aqui vou passar estado aos filhos para que eles usem o mesmo estado que o pai */

  return (
    <div className='overlay'>
      <div className="App">
        <NavBar accounts={accounts} setAccounts={setAccounts} />
        <MainMint accounts={accounts} setAccounts={setAccounts} />
      </div>

      <div className='moving-background'></div>
    </div>
  );
}

export default App;
