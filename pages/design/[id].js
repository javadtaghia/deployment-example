import React from "react";
import classNames from "classnames";
import style from "../../styles/Style.module.css";

export default function DesignViewer({ pages, artboards, designId }) {
  const [activePageIndex, setActivePageIndex] = React.useState(0);
  const [activeArtboardId, setActiveArtboardId] = React.useState();

  const activePageId = pages[activePageIndex]?.id;
  const artboardsInPage = artboards.filter(
    (artboard) => artboard.artboard.pageId === activePageId
  );

  return (
    <div className={style.designViewer}>
      <div className={style.leftSidebar}>
        <h1 className={style.headline}>🤖 Design viewer </h1>
        <ListPages
          pages={pages}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setActiveArtboardId={setActiveArtboardId}
        ></ListPages>
        <ListArtboards
          artboards={artboardsInPage}
          activePageId={pages[activePageIndex]?.id}
          activeArtboardId={activeArtboardId}
          setActiveArtboardId={setActiveArtboardId}
        ></ListArtboards>
      </div>
      <div className={style.mainContent}>
        <PageContent
          designId={designId}
          artboards={artboardsInPage}
          activeArtboardId={activeArtboardId}
        />
      </div>
    </div>
  );
}

function ListPages({
  pages,
  activePageIndex,
  setActivePageIndex,
  setActiveArtboardId,
}) {
  return (
    <div className={classNames(style.listItems, style.pages)}>
      <h2>📄 All Pages:</h2>
      <ul>
        {pages.map((page, index) => (
          <li
            key={page.id}
            className={classNames({
              [style.listItem]: true,
              [style.listItemActive]: activePageIndex == index,
            })}
            onClick={() => {
              setActiveArtboardId(undefined);
              setActivePageIndex(index);
            }}
          >
            {page.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListArtboards({ artboards, activeArtboardId, setActiveArtboardId }) {
  return (
    <div
      className={classNames(style.listItems, style.noBorder, style.artboards)}
    >
      <h2>🖼 Artboards:</h2>
      <ul>
        {artboards.map((artboard, index) => (
          <li
            key={artboard.artboard.id}
            className={classNames({
              [style.listItem]: true,
              [style.listItemActive]: activeArtboardId == artboard.artboard.id,
            })}
            onClick={() => setActiveArtboardId(artboard.artboard.id)}
          >
            {artboard.artboard.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageContent({ designId, artboards, activeArtboardId }) {
  const allFrameX = artboards.map((artboard) => artboard.frame.x);
  const allFrameY = artboards.map((artboard) => artboard.frame.y);
  const minFrameX = Math.min(...allFrameX);
  const minFrameY = Math.min(...allFrameY);

  return (
    <div className={style.pageContent}>
      {artboards.map((artboard) => (
        <ArtboardPreview
          key={artboard.artboard.id}
          designId={designId}
          top={-1 * minFrameY + artboard.frame.y}
          left={-1 * minFrameX + artboard.frame.x}
          name={artboard.artboard.name}
          artboardId={artboard.artboard.id}
          activeArtboardId={activeArtboardId}
        />
      ))}
    </div>
  );
}

function ArtboardPreview({
  designId,
  artboardId,
  activeArtboardId,
  top,
  left,
  name,
}) {
  const artboardRef = React.useRef(null);

  React.useEffect(() => {
    if (artboardId == activeArtboardId) {
      artboardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [activeArtboardId]);

  return (
    <div
      ref={artboardRef}
      className={classNames({
        [style.artboard]: true,
        [style.artboardActive]: artboardId == activeArtboardId,
      })}
      tabIndex={-1}
      style={{
        top,
        left,
      }}
    >
      <h3>{name}</h3>
      <img src={`/images/${designId}/${artboardId}.png`} />
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { id } = query;

  let [pagesRes, artboardsRes, previewsRes] = await Promise.all([
    fetch(`${process.env.ENDPOINT}/api/pages?designId=${id}`),
    fetch(`${process.env.ENDPOINT}/api/artboards?designId=${id}`),
    fetch(`${process.env.ENDPOINT}/api/previews?designId=${id}`),
  ]);

  const pages = await pagesRes.json();
  const artboards = await artboardsRes.json();
  const previews = await previewsRes.json();

  return {
    props: { pages, artboards, previews, designId: id },
  };
}
