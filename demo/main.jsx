import React from "react";
import { createRoot } from "react-dom/client";
import { FloatingMenu } from "../src/index.js";
import "./demo.css";

function Demo() {
  const [dark, setDark] = React.useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );
  const [toast, setToast] = React.useState(null);
  const timer = React.useRef();
  const say = (msg) => () => {
    clearTimeout(timer.current);
    setToast(msg);
    timer.current = setTimeout(() => setToast(null), 1400);
  };

  return (
    <main className={"demo" + (dark ? " dark" : "")}>
      <button className="theme" onClick={() => setDark(!dark)}>
        {dark ? "Light" : "Dark"} mode
      </button>
      <FloatingMenu
        onGitHub={say("GitHub")}
        onDownload={say("Download")}
        onSearch={say("Search")}
        onSave={say("Save to folder")}
        onLikeChange={(on) => say(on ? "Liked" : "Unliked")()}
        onComment={say("Comment")}
        onHistory={say("History")}
        onShare={say("Share")}
      />
      <div className="toast" data-on={!!toast}>{toast}</div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<Demo />);
