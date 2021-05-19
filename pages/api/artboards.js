import sdk from "../../lib/opendesign";

export default async (req, res) => {
  const { designId } = req.query;

  const design = await sdk.fetchDesignById(designId);

  let artboards = design.getArtboards();

  artboards = await Promise.all(
    artboards.map(async (artboard) => {
      const content = await artboard.getContent();
      return { artboard, frame: content.frame };
    })
  );

  res.status(200).json(artboards);
};
