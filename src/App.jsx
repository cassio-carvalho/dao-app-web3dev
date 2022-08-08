import { useAddress, useEditionDrop, useMetamask } from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';

const App = () => {
// Usa o hook connectWallet que o thirdweb nos dá.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  // console.log(address);

  // inicializar o contrato editionDrop
  const editionDrop =  useEditionDrop('0xF46BA2e0f616e473CE416713F6a355dc89753Bdb');

  // Variável de estado para sabermos se o usuário tem nosso NFT.
  const [ hasClaimedNFT, setHasClaimedNFT ] = useState(false);

  // isClaiming nos ajuda a saber se está no estado de carregando enquanto o NFT é cunhado.
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // Se ele não tiver uma carteira conectada, saia!
    if(!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        // Se o saldo for maior do que 0, ele tem nosso NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 esse usuário tem o NFT de membro!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 esse usuário NÃO tem o NFT de membro.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Falha ao ler saldo", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim('0', 1);
      console.log(`🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Falha ao cunhar NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Página dos membros da Game Changers DAO</h1>
        <p>Bora mudar o jogo!</p>
      </div>
    )
  };

// Caso o usuário já conectou a carteira
  return (
    <div className="mint-nft">
      <h1>Cunhe gratuitamente seu NFT de membro da Game Changers DAO</h1>
      <button
        disabled={isClaiming}
        onClick={mintNFT}
      >
        { isClaiming ? 'Cunhando...' : 'Cunhe seu NFT (GRÁTIS)'}
      </button>
    </div>
  )
}

export default App
