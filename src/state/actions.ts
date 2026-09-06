import type { Accent, EdgeKind } from "../schema/types";

export type GraphAction =
  | {
      type: "SELECT_ENTITY";
      entityId: string | null;
    }
  | {
      type: "SET_GLYPH";
      entityId: string;
      glyph: string;
    }
  | {
      type: "SET_ACCENT";
      entityId: string;
      accent: Accent;
    }
  | {
      type: "BIND_ENTITY";
      parentId: string;
      childId: string;
      edgeKind?: EdgeKind;
    }
  | {
      type: "OPEN_PICKER";
      entityId: string;
    }
  | {
      type: "CLOSE_PICKER";
    }
  | {
      type: "TOGGLE_SHOW_ALL_GLYPHS";
    }
  | {
      type: "CLEAR_TYPE_ERROR";
    }
  | {
      type: "SHOW_ME_TYPE_ERROR";
    };
