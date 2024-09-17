import sdk from "./1-initialize-sdk.js";

// Esse é o endereço do nosso contrato ERC-20 impresso no passo anterior.
const token = sdk.getToken('0x12515EA08F411A4d705bDC7504b534a2c8120AaB');

(async () => {
  try {
    // Qual o fornecimento máximo que você quer? 1,000,000 é um número legal!
    const amount = 1_000_000;

    // Interaja com o seu contrato ERC-20 e cunhe os tokens!
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();

    // Mostre quantos dos seus tokens existem agora!
    console.log("✅ Agora temos", totalSupply.displayValue, "$XP em circulação");
  } catch (error) {
    console.error("Falha ao imprimir o dinheiro", error);
  }
})();