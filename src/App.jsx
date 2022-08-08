import { useAddress, useEditionDrop, useMetamask, useToken } from '@thirdweb-dev/react';
import { useEffect, useMemo, useState } from 'react';

const App = () => {
// Usa o hook connectWallet que o thirdweb nos dá.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  // console.log(address);

  // inicializar o contrato editionDrop
  const editionDrop =  useEditionDrop('0xF46BA2e0f616e473CE416713F6a355dc89753Bdb');

  const token = useToken('0x12515EA08F411A4d705bDC7504b534a2c8120AaB');

  // Variável de estado para sabermos se o usuário tem nosso NFT.
  const [ hasClaimedNFT, setHasClaimedNFT ] = useState(false);

  // isClaiming nos ajuda a saber se está no estado de carregando enquanto o NFT é cunhado.
  const [isClaiming, setIsClaiming] = useState(false);

  // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
  const [ memberTokenAmounts, setMemberTokenAmounts ] = useState([]);
  // O array guardando todos os endereços dos nosso membros.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar tudo.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  // Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Pegue os usuários que tem nosso NFT com o tokenId 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Endereços de membros", memberAddresses);
      } catch (error) {
        console.error("falha ao pegar lista de membros", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // Esse useEffect pega o # de tokens que cada membro tem.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Pega todos os saldos.
    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Quantidades", amounts);
      } catch (error) {
        console.error("falha ao buscar o saldo dos membros", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Agora, nós combinamos os memberAddresses e os memberTokenAmounts em um único array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Se o endereço não está no memberTokenAmounts, isso significa que eles não
      // detêm nada do nosso token.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
  
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

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

  // Se o usuário já reivindicou seu NFT nós queremos mostrar a página interna da DAO para ele
// Apenas membros da DAO vão ver isso. Renderize todos os membros + quantidade de tokens
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Página dos membros da Game Changers DAO</h1>
        <p>Bora mudar o jogo!</p>
        <div>
        <div>
          <h2>Lista de Membros</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Endereço</th>
                <th>Quantidade de Tokens</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
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
