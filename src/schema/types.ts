export const ENTITY_TYPES = [
  "HUMAN",
  "PLACE",
  "THING",
  "ACTION",
  "GUARDIAN",
  "TRACE",
  "CONNECTOR",
  "SYSTEM",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const ACCENTS = [
  "amber",
  "cyan",
  "violet",
  "obsidian",
  "inherited",
] as const;

export type Accent = (typeof ACCENTS)[number];

export const EDGE_KINDS = ["CONTAINS", "THREAD", "ROUTES_TO"] as const;

export type EdgeKind = (typeof EDGE_KINDS)[number];

export const GLYPH_CATEGORIES = [
  "IDENTITY",
  "PLACE",
  "THING",
  "ACTION",
  "GUARDIAN",
  "TRACE",
  "CONNECTOR",
  "SYSTEM",
] as const;

export type GlyphCategory = (typeof GLYPH_CATEGORIES)[number];

export interface HistoryEntry {
  at: string;
  event: string;
}

export interface RescopeEntity {
  id: string;
  type: EntityType;
  name: string;
  glyph: string;
  accent: Accent;
  state: string;
  capabilities: readonly string[];
  history: readonly HistoryEntry[];
}

export interface RescopeEdge {
  id: string;
  parentId: string;
  childId: string;
  kind: EdgeKind;
}

export interface BindingError {
  code: "TYPE_ERROR";
  parent: Pick<RescopeEntity, "id" | "type" | "name">;
  child: Pick<RescopeEntity, "id" | "type" | "name">;
  expected: readonly EntityType[];
  lesson: string;
}

export interface GlyphDefinition {
  id: string;
  icon: string;
  label: string;
  categories: readonly GlyphCategory[];
  validFor: readonly EntityType[];
  keywords: readonly string[];
}

export interface GlyphMatch extends GlyphDefinition {
  compatible: boolean;
}

export interface TypeErrorState extends BindingError {
  kind: EdgeKind;
}

export interface TraceEvent {
  id: string;
  at: number;
  kind: "GLYPH" | "ACCENT" | "BIND" | "TYPE_ERROR" | "SELECT" | "PICKER";
  message: string;
}

export interface GraphState {
  entities: Record<string, RescopeEntity>;
  edges: RescopeEdge[];
  selectedEntityId: string | null;
  pickerOpen: boolean;
  showAllGlyphs: boolean;
  typeError: TypeErrorState | null;
  highlightEntityIds: string[];
  trace: TraceEvent[];
}
