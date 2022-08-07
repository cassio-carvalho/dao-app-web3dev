import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop('0xF46BA2e0f616e473CE416713F6a355dc89753Bdb');

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: 'Capa de filiação Game Changer',
        description: 'NFT de acesso à Game Changers DAO',
        image: readFileSync('scripts/assets/capa.jpeg'),
      },
    ]);
    console.log('✅ Novo NFT criado com sucesso!');
  } catch (error) {
    console.error("falha ao criar o novo NFT", error);
  }
})()
