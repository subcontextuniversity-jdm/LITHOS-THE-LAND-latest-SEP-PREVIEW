import { glyphById } from "./search.ts";

// The quiet structural win: the lexicon is also the receipt-rendering language.
// A receipt is legible at a glance because WHO / DECISION / BOUNDARY render with
// the same glyphs used on maps and in refusals. One vocabulary, three surfaces.

export interface ReceiptField {
  label: string;
  render: string;
}

export interface RenderedReceipt {
  ref: string;
  fields: ReceiptField[];
}

function m(id: string): string {
  return glyphById(id)?.mark ?? "�";
}

// RECEIPT://0042 — TALON asks to move value out of a build boundary; Guardian
// grants a single-use crossing, and the event is stamped.
export function sampleReceipt(): RenderedReceipt {
  return {
    ref: "RECEIPT://0042",
    fields: [
      { label: "WHO", render: `${m("talon")} TALON` },
      { label: "DECISION", render: `${m("allow-once")} ALLOW ONCE` },
      { label: "BOUNDARY", render: `[BUILD] ${m("send")} [MONEY]` },
      { label: "PROOF", render: `${m("verified")} VERIFIED · ${m("hash")} 0x9f42 · ${m("trace")} 06:18Z` },
    ],
  };
}
