import { useAddress, useMetamask } from "@thirdweb-dev/react";

const App = () => {
// Usa o hook connectWallet que o thirdweb nos dá.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  // console.log(address);

  // Caso o usuário ainda não conectou sua carteira, deixe ele chamar connectWallet.
  if(!address){
    return (
      <div className="landing">
        <h1>Bem-vind@s à Game Changers - DAO!</h1>
        <button
        onClick={ connectWithMetamask }
        className="btn-hero"
        >
          Conecte sua carteira
        </button>
      </div>
    );
  }
// Caso o usuário já conectou a carteira
  return (
    <div className="landing">
      <h1>Carteira conectada</h1>
    </div>
  )
}

export default App
