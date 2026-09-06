import type { ReactNode, SVGProps } from "react";

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg {...svgProps} className="glyph-svg">
      {children}
    </svg>
  );
}

export function GlyphIcon({ name }: { name: string }) {
  switch (name) {
    case "user":
      return (
        <Frame>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19c1.2-3.2 3.2-4.8 6.5-4.8S17.8 15.8 19 19" />
        </Frame>
      );
    case "brackets":
      return (
        <Frame>
          <path d="M8 5H6v14h2" />
          <path d="M16 5h2v14h-2" />
        </Frame>
      );
    case "boundary":
      return (
        <Frame>
          <path d="M8 5H6v14h2" />
          <path d="M16 5h2v14h-2" />
        </Frame>
      );
    case "square":
      return (
        <Frame>
          <rect x="6" y="6" width="12" height="12" />
        </Frame>
      );
    case "diamond-outline":
      return (
        <Frame>
          <path d="M12 4l8 8-8 8-8-8z" />
        </Frame>
      );
    case "diamond":
      return (
        <Frame>
          <path d="M12 4l8 8-8 8-8-8z" />
          <path d="M8.5 12h7" />
        </Frame>
      );
    case "home":
      return (
        <Frame>
          <path d="M4 11.5 12 5l8 6.5" />
          <path d="M7 10.5V19h10v-8.5" />
        </Frame>
      );
    case "grid":
      return (
        <Frame>
          <rect x="5" y="5" width="6" height="6" />
          <rect x="13" y="5" width="6" height="6" />
          <rect x="5" y="13" width="6" height="6" />
          <rect x="13" y="13" width="6" height="6" />
        </Frame>
      );
    case "folder":
      return (
        <Frame>
          <path d="M4 8h6l2 2h8v9H4z" />
          <path d="M4 8V6h5l1.5 2" />
        </Frame>
      );
    case "workspace":
      return (
        <Frame>
          <rect x="4" y="7" width="16" height="12" />
          <path d="M8 7V5h8v2" />
        </Frame>
      );
    case "cube":
      return (
        <Frame>
          <path d="M12 4l8 4.5v7L12 20l-8-4.5v-7z" />
          <path d="M12 20v-7" />
          <path d="M4 8.5l8 4.5 8-4.5" />
        </Frame>
      );
    case "hexagon":
      return (
        <Frame>
          <path d="M8 5h8l4 7-4 7H8l-4-7z" />
        </Frame>
      );
    case "circle":
      return (
        <Frame>
          <circle cx="12" cy="12" r="7" />
        </Frame>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="glyph-svg" aria-hidden>
          <path
            fill="currentColor"
            stroke="none"
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2z"
          />
        </svg>
      );
    case "link":
      return (
        <Frame>
          <path d="M10 13a5 5 0 0 0 7.5.15l1.35-1.35a5 5 0 0 0-7.07-7.07L10.6 6" />
          <path d="M14 11a5 5 0 0 0-7.5-.15L5.15 12.2a5 5 0 0 0 7.07 7.07L13.4 18" />
        </Frame>
      );
    case "plug":
      return (
        <Frame>
          <path d="M9 7v4" />
          <path d="M15 7v4" />
          <path d="M8 11h8v3a4 4 0 0 1-8 0z" />
          <path d="M12 18v3" />
        </Frame>
      );
    case "node":
      return (
        <Frame>
          <circle cx="7" cy="12" r="2.4" />
          <circle cx="17" cy="7" r="2.4" />
          <circle cx="17" cy="17" r="2.4" />
          <path d="M9.2 11.2 14.8 8.2" />
          <path d="M9.2 12.8 14.8 15.8" />
        </Frame>
      );
    case "arrow-right":
      return (
        <Frame>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </Frame>
      );
    case "play":
      return (
        <Frame>
          <path d="M8 6l12 6-12 6z" />
        </Frame>
      );
    case "shield":
      return (
        <Frame>
          <path d="M12 3 19 6v6c0 4.5-3 7.2-7 9-4-1.8-7-4.5-7-9V6z" />
        </Frame>
      );
    case "gate":
      return (
        <Frame>
          <path d="M5 20V8l7-4 7 4v12" />
          <path d="M5 11h14" />
          <circle cx="12" cy="15" r="1" />
        </Frame>
      );
    case "path":
      return (
        <Frame>
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 16c2-6 6-8 8-10" />
        </Frame>
      );
    case "hash":
      return (
        <Frame>
          <path d="M9 5 7 19" />
          <path d="M17 5l-2 14" />
          <path d="M5 9h15" />
          <path d="M4 15h15" />
        </Frame>
      );
    case "receipt":
      return (
        <Frame>
          <path d="M7 4h10v16l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4z" />
          <path d="M9 9h6" />
          <path d="M9 13h6" />
        </Frame>
      );
    case "terminal":
      return (
        <Frame>
          <rect x="4" y="6" width="16" height="12" />
          <path d="M7 10l3 2-3 2" />
          <path d="M12 14h5" />
        </Frame>
      );
    default:
      return (
        <Frame>
          <circle cx="12" cy="12" r="7" />
          <path d="M9 12h6" />
        </Frame>
      );
  }
}
