import React from "react";
import { useRouter } from "next/router";
import style from "../styles/Style.module.css";

export default function App() {
  const router = useRouter();
  const [designId, setDesignId] = React.useState("");
  const [loadingText, setLoadingText] = React.useState("");

  return (
    <div className={style.welcome}>
      <div className={style.provideDesign}>
        <h1>🤖 Design viewer </h1>
        <label htmlFor="designId">Provide a design ID:</label>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setLoadingText("Loading - it may take a minute");
            router.push(`/design/${designId}`);
          }}
        >
          <input
            type="text"
            placeholder="Design ID"
            id="designId"
            required
            value={designId}
            onChange={(event) => setDesignId(event.target.value)}
          />
          <button>{loadingText || "Open"}</button>
        </form>
      </div>
    </div>
  );
}
