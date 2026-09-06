import { describe, expect, it } from "vitest";
import { authorityOf } from "../schema/locks";
import { IDS, initialState } from "./initial-state";
import { deserializeGraph, serializeGraph } from "./persistence";
import { graphReducer } from "./reducer";
import { authorityReferencesUnchanged, identityUnchanged } from "./selectors";

describe("L-01 glyph change preserves identity", () => {
  it("changes representation without changing identity", () => {
    const before = initialState.entities[IDS.github];

    const next = graphReducer(initialState, {
      type: "SET_GLYPH",
      entityId: before.id,
      glyph: "cube",
    });

    const after = next.entities[IDS.github];

    expect(after.id).toBe(before.id);
    expect(after.type).toBe(before.type);
    expect(after.name).toBe(before.name);
    expect(after.glyph).toBe("cube");
    expect(after.state).toBe("CONNECTED");
    expect(identityUnchanged(before, after)).toBe(true);
  });
});

describe("L-02 accent is representation only", () => {
  it("does not mutate scope, history, or capabilities", () => {
    const before = initialState.entities[IDS.github];
    const next = graphReducer(initialState, {
      type: "SET_ACCENT",
      entityId: before.id,
      accent: "violet",
    });
    const after = next.entities[IDS.github];

    expect(after.accent).toBe("violet");
    expect(after.history).toBe(before.history);
    expect(after.capabilities).toBe(before.capabilities);
    expect(next.edges).toBe(initialState.edges);
    expect(authorityOf(after)).toEqual(authorityOf(before));
  });
});

describe("L-03 / L-04 reducer bindings", () => {
  it("records TYPE ERROR and does not add ACTION under PLACE", () => {
    const next = graphReducer(initialState, {
      type: "BIND_ENTITY",
      parentId: IDS.build,
      childId: IDS.send,
    });

    expect(next.edges).toEqual(initialState.edges);
    expect(next.typeError?.code).toBe("TYPE_ERROR");
    expect(next.typeError?.child.type).toBe("ACTION");
    expect(next.typeError?.parent.type).toBe("PLACE");
    expect(next.typeError?.lesson).toContain(
      "They do not become children of Place boundaries.",
    );
  });

  it("accepts CONNECTOR under PLACE", () => {
    const next = graphReducer(initialState, {
      type: "BIND_ENTITY",
      parentId: IDS.build,
      childId: IDS.probe,
    });

    expect(next.typeError).toBeNull();
    expect(
      next.edges.some(
        (edge) =>
          edge.parentId === IDS.build &&
          edge.childId === IDS.probe &&
          edge.kind === "CONTAINS",
      ),
    ).toBe(true);
    expect(next.entities[IDS.probe].type).toBe("CONNECTOR");
  });
});

describe("L-07 ephemeral persistence", () => {
  it("restores entities and edges from a serialized snapshot", () => {
    const edited = graphReducer(initialState, {
      type: "SET_GLYPH",
      entityId: IDS.github,
      glyph: "cube",
    });
    const raw = serializeGraph(edited);
    const restored = deserializeGraph(raw);

    expect(restored).not.toBeNull();
    expect(restored?.entities[IDS.github].glyph).toBe("cube");
    expect(restored?.entities[IDS.github].id).toBe(IDS.github);
    expect(restored?.edges).toEqual(edited.edges);
    expect(JSON.parse(raw).mode).toBe("EPHEMERAL");
  });
});

describe("L-08 no authority mutation from visual edit", () => {
  it("SET_GLYPH does not rebuild identity, drop edges, or reset permissions", () => {
    const before = initialState.entities[IDS.github];
    const next = graphReducer(initialState, {
      type: "SET_GLYPH",
      entityId: before.id,
      glyph: "cube",
    });
    const after = next.entities[IDS.github];

    expect(after).not.toBe(before);
    expect(after.id).toBe("CONNECTOR://0041");
    expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
    expect(after.capabilities).toBe(before.capabilities);
    expect(after.history).toBe(before.history);
    expect(authorityReferencesUnchanged(before, after)).toBe(true);
    expect(next.edges).toBe(initialState.edges);
    expect(next.edges).toHaveLength(initialState.edges.length);
    expect(authorityOf(after)).toEqual(authorityOf(before));
    expect(after.state).toBe("CONNECTED");
  });

  it("does not create a descendant when representation changes", () => {
    const next = graphReducer(initialState, {
      type: "SET_GLYPH",
      entityId: IDS.github,
      glyph: "cube",
    });
    expect(Object.keys(next.entities)).toEqual(Object.keys(initialState.entities));
  });
});

describe("LOCK 04 edge kinds stay distinct in state", () => {
  it("THREAD bind of ACTION under PLACE is not a CONTAINS child", () => {
    const next = graphReducer(initialState, {
      type: "BIND_ENTITY",
      parentId: IDS.build,
      childId: IDS.send,
      edgeKind: "THREAD",
    });

    expect(next.typeError).toBeNull();
    const thread = next.edges.find((edge) => edge.kind === "THREAD");
    expect(thread?.childId).toBe(IDS.send);
    expect(
      next.edges.some(
        (edge) =>
          edge.kind === "CONTAINS" &&
          edge.parentId === IDS.build &&
          edge.childId === IDS.send,
      ),
    ).toBe(false);
  });
});
