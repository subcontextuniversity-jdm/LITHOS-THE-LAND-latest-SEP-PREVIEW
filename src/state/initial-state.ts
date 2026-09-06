import type { GraphState, RescopeEntity } from "../schema/types";

function entity(
  value: RescopeEntity,
): RescopeEntity {
  return {
    ...value,
    capabilities: Object.freeze([...value.capabilities]),
    history: Object.freeze(value.history.map((entry) => Object.freeze({ ...entry }))),
  };
}

export const IDS = Object.freeze({
  josh: "HUMAN://0001",
  home: "PLACE://0001",
  build: "PLACE://0002",
  github: "CONNECTOR://0041",
  send: "ACTION://0001",
  probe: "CONNECTOR://0042",
  edgeJoshHome: "EDGE://0001",
  edgeHomeBuild: "EDGE://0002",
  edgeBuildGithub: "EDGE://0003",
});

export const initialEntities: Record<string, RescopeEntity> = {
  [IDS.josh]: entity({
    id: IDS.josh,
    type: "HUMAN",
    name: "Josh",
    glyph: "user",
    accent: "inherited",
    state: "ACTIVE",
    capabilities: ["choose", "tie-knot"],
    history: [{ at: "seed", event: "Cursor bound as HUMAN://0001" }],
  }),
  [IDS.home]: entity({
    id: IDS.home,
    type: "PLACE",
    name: "RESCOPE//HOME",
    glyph: "boundary",
    accent: "obsidian",
    state: "ACTIVE",
    capabilities: ["contain"],
    history: [{ at: "seed", event: "Home place opened" }],
  }),
  [IDS.build]: entity({
    id: IDS.build,
    type: "PLACE",
    name: "BUILD",
    glyph: "brackets",
    accent: "cyan",
    state: "ACTIVE",
    capabilities: ["contain", "work"],
    history: [{ at: "seed", event: "Build scope opened under HOME" }],
  }),
  [IDS.github]: entity({
    id: IDS.github,
    type: "CONNECTOR",
    name: "GitHub",
    glyph: "github",
    accent: "inherited",
    state: "CONNECTED",
    capabilities: ["clone", "push", "pull-request"],
    history: [{ at: "seed", event: "Connected under BUILD" }],
  }),
  [IDS.send]: entity({
    id: IDS.send,
    type: "ACTION",
    name: "SEND",
    glyph: "arrow-right",
    accent: "amber",
    state: "DORMANT",
    capabilities: ["operate"],
    history: [{ at: "seed", event: "Unbound. Not a child of BUILD." }],
  }),
  [IDS.probe]: entity({
    id: IDS.probe,
    type: "CONNECTOR",
    name: "Probe",
    glyph: "plug",
    accent: "inherited",
    state: "DORMANT",
    capabilities: ["connect"],
    history: [{ at: "seed", event: "Unbound connector, ready to bind under PLACE" }],
  }),
};

export const initialState: GraphState = {
  entities: initialEntities,
  edges: [
    {
      id: IDS.edgeJoshHome,
      parentId: IDS.josh,
      childId: IDS.home,
      kind: "CONTAINS",
    },
    {
      id: IDS.edgeHomeBuild,
      parentId: IDS.home,
      childId: IDS.build,
      kind: "CONTAINS",
    },
    {
      id: IDS.edgeBuildGithub,
      parentId: IDS.build,
      childId: IDS.github,
      kind: "CONTAINS",
    },
  ],
  selectedEntityId: null,
  pickerOpen: false,
  showAllGlyphs: false,
  typeError: null,
  highlightEntityIds: [],
  trace: [
    {
      id: "TRACE://seed",
      at: 0,
      kind: "BIND",
      message: "JOSH → RESCOPE//HOME → BUILD → GitHub",
    },
  ],
};

export const PERSISTENCE = Object.freeze({
  key: "rescope.graph.ephemeral.v1",
  mode: "EPHEMERAL",
  note: "Session storage in this tab. Not a ledger. Reload restores representation and tree. Close the tab and it is gone.",
});
