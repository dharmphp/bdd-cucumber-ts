import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { AppWorld } from '../support/world.js';

Given('the catalog contains', function (this: AppWorld, table: DataTable) {
  for (const row of table.hashes()) {
    this.catalog.add({ sku: row.sku!, name: row.name!, price: Number(row.price) });
  }
});

When('I add {int} {string}', function (this: AppWorld, qty: number, sku: string) {
  this.attempt(() => this.cart.add(sku, qty));
});

When('I apply coupon {string}', function (this: AppWorld, code: string) {
  this.attempt(() => this.cart.applyCoupon(code));
});

Then('the cart has {int} items', function (this: AppWorld, n: number) {
  assert.equal(this.cart.count, n);
});

Then('the subtotal is {float}', function (this: AppWorld, n: number) {
  assert.equal(this.cart.subtotal, n);
});

Then('the discount is {float}', function (this: AppWorld, n: number) {
  assert.equal(this.cart.discount, n);
});

Then('shipping is {float}', function (this: AppWorld, n: number) {
  assert.equal(this.cart.shipping, n);
});

Then('the cart total is {float}', function (this: AppWorld, n: number) {
  assert.equal(this.cart.total, n);
});
