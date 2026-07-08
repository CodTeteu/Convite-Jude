import sharp from "sharp";
import path from "path";

const sourceImage = "C:\\Users\\matca\\.gemini\\antigravity-ide\\brain\\9ec98477-7c97-4d91-bc30-628a4e063109\\media__1783468963393.png";

const outputLogo = path.resolve("public/images/logo.png");
const outputFavicon = path.resolve("public/favicon.png");

async function run() {
  try {
    console.log("Recortando bordas brancas da logo...");
    
    // Para a logo na navegação, apenas recortamos o excesso
    await sharp(sourceImage)
      .trim()
      .toFile(outputLogo);
      
    // Para o favicon, recortamos e adicionamos um padding bem pequeno de 2px para não encostar nas bordas da aba
    await sharp(sourceImage)
      .trim()
      .extend({
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
        background: { r: 255, g: 255, b: 255, alpha: 0 } // transparente
      })
      .toFile(outputFavicon);

    console.log("Logo e Favicon processados com sucesso!");
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
  }
}

run();
