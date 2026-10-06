const DEFAULT_ELLIPSIS = '...';

function toText(value) {
  return String(value ?? '');
}

/**
 * Truncate text to at most maxLength characters, reserving room for ellipsis.
 */
export function truncate(value, maxLength, { ellipsis = DEFAULT_ELLIPSIS } = {}) {
  const text = toText(value);
  if (!Number.isFinite(maxLength) || maxLength < 0) {
    throw new RangeError('maxLength must be a non-negative finite number');
  }
  if (text.length <= maxLength) {
    return text;
  }
  if (maxLength === 0) {
    return '';
  }
  if (ellipsis.length >= maxLength) {
    return text.slice(0, maxLength);
  }
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Pad text to width without truncating longer input.
 */
export function pad(value, width, { align = 'start', fill = ' ' } = {}) {
  const text = toText(value);
  if (!Number.isFinite(width) || width < 0) {
    throw new RangeError('width must be a non-negative finite number');
  }
  if (text.length >= width) {
    return text;
  }
  if (align === 'start') {
    return text.padStart(width, fill);
  }
  if (align === 'end') {
    return text.padEnd(width, fill);
  }
  if (align === 'center') {
    const extra = width - text.length;
    const leading = Math.floor(extra / 2);
    return text.padStart(text.length + leading, fill).padEnd(width, fill);
  }
  throw new RangeError('align must be "start", "end", or "center"');
}

/**
 * Fixed-width field: pad when short, truncate (with ellipsis) when long.
 */
export function fit(value, width, options = {}) {
  const text = toText(value);
  if (!Number.isFinite(width) || width < 0) {
    throw new RangeError('width must be a non-negative finite number');
  }
  if (text.length <= width) {
    return pad(text, width, options);
  }
  return truncate(text, width, options);
}
