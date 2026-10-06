import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fit, pad, truncate } from '../src/truncate-pad.js';

describe('truncate', () => {
  it('returns shorter strings unchanged', () => {
    assert.equal(truncate('hi', 5), 'hi');
  });

  it('includes ellipsis in the max length budget', () => {
    assert.equal(truncate('hello world', 8), 'hello...');
    assert.equal(truncate('hello world', 8).length, 8);
  });

  it('handles maxLength smaller than ellipsis', () => {
    assert.equal(truncate('abcdef', 2), 'ab');
  });

  it('coerces nullish values to empty string', () => {
    assert.equal(truncate(null, 3), '');
    assert.equal(truncate(undefined, 3), '');
  });
});

describe('pad', () => {
  it('pads to width with default start alignment', () => {
    assert.equal(pad('x', 4), '   x');
  });

  it('does not truncate when input is longer than width', () => {
    assert.equal(pad('toolong', 3), 'toolong');
  });
});

describe('fit', () => {
  it('pads short values to the target width', () => {
    assert.equal(fit('ok', 5), '   ok');
  });

  it('truncates long values to the target width', () => {
    assert.equal(fit('extra long label', 10), 'extra l...');
    assert.equal(fit('extra long label', 10).length, 10);
  });

  it('respects pad alignment when padding', () => {
    assert.equal(fit('x', 3, { align: 'end' }), 'x  ');
  });
});
