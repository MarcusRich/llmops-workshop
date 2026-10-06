const HIGH_SURROGATE_MIN = 0xd800;
const HIGH_SURROGATE_MAX = 0xdbff;
const LOW_SURROGATE_MIN = 0xdc00;
const LOW_SURROGATE_MAX = 0xdfff;

/**
 * Fit text into a fixed column width.
 * Longer values are truncated. Shorter values are padded.
 * A cut never splits a UTF-16 surrogate pair; the result is padded
 * back to `width` when that step leaves a spare column.
 *
 * @param {unknown} value
 * @param {number} width
 * @param {{ pad?: string, ellipsis?: string, align?: "start" | "end" }} [options]
 * @returns {string}
 */
export function truncateAndPad(value, width, options = {}) {
  if (!Number.isInteger(width) || width < 0) {
    throw new RangeError("width must be a non-negative integer");
  }

  const pad = options.pad ?? " ";
  const ellipsis = options.ellipsis ?? "";
  const align = options.align ?? "start";

  if (pad.length !== 1) {
    throw new RangeError("pad must be a single code unit");
  }
  if (align !== "start" && align !== "end") {
    throw new RangeError('align must be "start" or "end"');
  }
  if (ellipsis.length > width) {
    throw new RangeError("ellipsis must not be longer than width");
  }

  const text = value == null ? "" : String(value);
  const truncated = truncate(text, width, ellipsis);
  const missing = width - truncated.length;
  if (missing === 0) {
    return truncated;
  }

  const filler = pad.repeat(missing);
  return align === "end" ? filler + truncated : truncated + filler;
}

function truncate(text, width, ellipsis) {
  if (text.length <= width) {
    return text;
  }

  const budget = width - ellipsis.length;
  return text.slice(0, cutIndex(text, budget)) + ellipsis;
}

function cutIndex(text, budget) {
  if (budget <= 0 || budget >= text.length) {
    return Math.max(0, budget);
  }

  const before = text.charCodeAt(budget - 1);
  const after = text.charCodeAt(budget);
  if (isHighSurrogate(before) && isLowSurrogate(after)) {
    return budget - 1;
  }
  return budget;
}

function isHighSurrogate(code) {
  return code >= HIGH_SURROGATE_MIN && code <= HIGH_SURROGATE_MAX;
}

function isLowSurrogate(code) {
  return code >= LOW_SURROGATE_MIN && code <= LOW_SURROGATE_MAX;
}
