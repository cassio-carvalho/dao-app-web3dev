import { ThirdwebSDK } from "@thirdweb-dev/sdk";

//Importando e configurando nosso arquivo .env para que possamos usar nossas variáveis de ambiente de maneira segura
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

// Algumas verificações rápidas para ter certeza de que nosso .env está funcionando.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Chave privada não encontrada.');
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  console.log('🛑 Alchemy API não encontrada.');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  console.log('🛑 Endereço de carteira não encontrado.');
}

// RPC URL, nós usaremos nossa URL da API do Alchemy do nosso arquivo .env.

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);

// A chave privada da nossa carteira. SEMPRE MANTENHA ISSO PRIVADO, NÃO COMPARTILHE COM NINGUÉM, adicione no seu arquivo .env e NÃO comite aquele arquivo para o github!

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log(`SDK inicializado pelo endereço: ${ address }`);
  } catch (error) {
    console.error(`Falha ao buscar apps no sdk. ${ error }`);
    process.exit(1)
  }
})()

export default sdk;
