import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken('0x12515EA08F411A4d705bDC7504b534a2c8120AaB');

(async () => {
  try {
    // Mostre os papeis atuais.
    const allRoles = await token.roles.getAll();

    console.log("👀 Papeis que existem agora:", allRoles);

    // Remova todos os superpoderes que sua carteira tinha sobre o contrato ERC-20.
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Papeis depois de remover nós mesmos",
      await token.roles.getAll()
    );
    console.log("✅ Revogados nossos super-poderes sobre os tokens ERC-20");

  } catch (error) {
    console.error("Falha ao remover nossos direitos sobre o tesouro da DAO", error);
  }
})();
