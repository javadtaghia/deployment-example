import sdk from "../../lib/opendesign";
import fs from "fs";

export default async (req, res) => {
  const { designId } = req.query;

  sdk.setGlobalFontDirectory("./fonts");
  sdk.setGlobalFallbackFonts("Inter-Regular");

  const design = await sdk.fetchDesignById(designId);
  const artboards = design.getArtboards();

  if (!fs.existsSync("./public/images/")) {
    fs.mkdirSync("./public/images/");
  }

  const folderPath = `./public/images/${design.id}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    await Promise.all(
      artboards.map((artboard) => {
        return artboard.renderToFile(`${folderPath}/${artboard.id}.png`);
      })
    );
  }

  res.status(200).json({ ok: 1 });
};
