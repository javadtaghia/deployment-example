import sdk from "../../lib/opendesign";

export default async (req, res) => {
  const { designId } = req.query;

  const design = await sdk.fetchDesignById(designId);

  const pages = design.getPages();

  res.status(200).json(pages);
};
