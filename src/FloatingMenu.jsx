import React from "react";
import { Icon } from "./icons.jsx";
import "./FloatingMenu.css";

/* ── Primitives (shadcn-style, trimmed to what the menu needs) ───────────── */

function Tooltip({ content, side = "right", children }) {
  const [show, setShow] = React.useState(false);
  return (
    <span
      className="fm-tooltip-anchor"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span role="tooltip" className="fm-tooltip" data-side={side}>
          {content}
        </span>
      )}
    </span>
  );
}

function IconButton({ icon, label, variant = "ghost", className, ...props }) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        className={"fm-btn" + (className ? " " + className : "")}
        data-variant={variant}
        aria-label={label}
        {...props}
      >
        <Icon name={icon} />
      </button>
    </Tooltip>
  );
}

/* ── State helpers ───────────────────────────────────────────────────────── */

function usePersistentState(key, initial) {
  const [value, setValue] = React.useState(() => {
    if (!key) return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  const set = React.useCallback(
    (next) => {
      setValue(next);
      if (!key) return;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep in-memory state */
      }
    },
    [key]
  );
  return [value, set];
}

/* ── FloatingMenu ────────────────────────────────────────────────────────── */

/**
 * A vertical floating action rail for article / docs pages.
 *
 * The top group is always visible; the bottom group collapses with a smooth
 * height + fade transition, toggled by the chevron button.
 */
export function FloatingMenu({
  onGitHub,
  onDownload,
  onSearch,
  onSave,
  onComment,
  onHistory,
  onShare,
  liked: likedProp,
  onLikeChange,
  defaultOpen = true,
  storageKey = "floating-menu-open",
  className,
}) {
  const [open, setOpen] = usePersistentState(storageKey, defaultOpen);
  const [likedState, setLikedState] = React.useState(false);
  const liked = likedProp ?? likedState;
  const toggleLike = () => {
    const next = !liked;
    if (likedProp === undefined) setLikedState(next);
    onLikeChange?.(next);
  };

  return (
    <aside className={"fmenu" + (className ? " " + className : "")}>
      <div className="fm-stick">
        <div className="fm-grp">
          <IconButton icon="github" label="GitHub" onClick={onGitHub} />
          <IconButton icon="download" label="Download" onClick={onDownload} />
          <IconButton icon="search" label="Search" onClick={onSearch} />
        </div>

        <div className="fm-body" data-open={open} aria-hidden={!open}>
          <div className="fm-inner">
            <div className="fm-separator" role="none" />
            <div className="fm-grp">
              <IconButton icon="bookmark-add" label="Save to folder" onClick={onSave} tabIndex={open ? 0 : -1} />
              <IconButton
                icon={liked ? "thumbs-up-on" : "thumbs-up"}
                label={liked ? "Liked" : "Like"}
                className="fm-like"
                aria-pressed={liked}
                data-on={liked}
                onClick={toggleLike}
                tabIndex={open ? 0 : -1}
              />
              <IconButton icon="comment" label="Comment" onClick={onComment} tabIndex={open ? 0 : -1} />
              <IconButton icon="history" label="History" onClick={onHistory} tabIndex={open ? 0 : -1} />
              <IconButton icon="share" label="Share" onClick={onShare} tabIndex={open ? 0 : -1} />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="fm-btn fm-toggle"
          data-variant="default"
          data-open={open}
          aria-label={open ? "Collapse menu" : "Expand menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name="chevron-down" />
        </button>
      </div>
    </aside>
  );
}

export default FloatingMenu;
