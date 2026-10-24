import { Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { AppWorld } from '../support/world.js';

Then('I see the error {string}', function (this: AppWorld, message: string) {
  assert.ok(this.error, 'expected an error');
  assert.equal(this.error.message, message);
});
