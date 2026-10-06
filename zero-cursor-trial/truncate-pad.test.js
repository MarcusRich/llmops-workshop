import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { truncateAndPad } from "./truncate-pad.js";

describe("truncateAndPad", () => {
  it("pads a short value on the end", () => {
    assert.equal(truncateAndPad("hi", 5), "hi   ");
  });

  it("pads a short value on the start", () => {
    assert.equal(truncateAndPad("hi", 5, { align: "end", pad: "0" }), "000hi");
  });

  it("leaves an exact fit unchanged", () => {
    assert.equal(truncateAndPad("hello", 5), "hello");
  });

  it("truncates without an ellipsis", () => {
    assert.equal(truncateAndPad("hello", 3), "hel");
  });

  it("counts the ellipsis toward the width", () => {
    assert.equal(truncateAndPad("hello", 4, { ellipsis: "…" }), "hel…");
  });

  it("does not split a surrogate pair, then pads the spare column", () => {
    assert.equal(truncateAndPad("a😀b", 2), "a ");
    assert.equal(truncateAndPad("😀", 1), " ");
  });

  it("pads after a surrogate-safe cut that includes an ellipsis", () => {
    assert.equal(truncateAndPad("a😀b", 3, { ellipsis: "." }), "a. ");
  });

  it("treats null and undefined as empty before padding", () => {
    assert.equal(truncateAndPad(null, 2), "  ");
    assert.equal(truncateAndPad(undefined, 2, { align: "end" }), "  ");
  });

  it("stringifies other values before fitting", () => {
    assert.equal(truncateAndPad(42, 4, { align: "end" }), "  42");
  });

  it("returns an empty string for width zero", () => {
    assert.equal(truncateAndPad("hello", 0), "");
  });

  it("rejects an invalid width, pad, align, or ellipsis", () => {
    assert.throws(() => truncateAndPad("hi", -1), RangeError);
    assert.throws(() => truncateAndPad("hi", 1.5), RangeError);
    assert.throws(() => truncateAndPad("hi", 3, { pad: "ab" }), RangeError);
    assert.throws(() => truncateAndPad("hi", 3, { align: "center" }), RangeError);
    assert.throws(() => truncateAndPad("hi", 1, { ellipsis: "..." }), RangeError);
  });
});
