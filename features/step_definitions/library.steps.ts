import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { AppWorld } from '../support/world.js';

Given('today is {string}', function (this: AppWorld, date: string) {
  this.clock = new Date(`${date}T00:00:00Z`);
});

Given(/^the library has (\d+) cop(?:y|ies) of "([^"]+)" titled "([^"]+)"$/, function (this: AppWorld, copies: string, isbn: string, title: string) {
  this.library.addBook({ isbn, title, copies: Number(copies) });
});

When('{string} borrows {string}', function (this: AppWorld, member: string, isbn: string) {
  this.attempt(() => this.library.borrow(member, isbn));
});

When('{string} returns {string}', function (this: AppWorld, member: string, isbn: string) {
  this.attempt(() => this.library.giveBack(member, isbn));
});

When('{string} pays {float}', function (this: AppWorld, member: string, amount: number) {
  this.library.payFine(member, amount);
});

Then(/^(\d+) cop(?:y|ies) of "([^"]+)" (?:is|are) available$/, function (this: AppWorld, n: string, isbn: string) {
  assert.equal(this.library.available(isbn), Number(n));
});

Then('{string} has {int} loan due {string}', function (this: AppWorld, member: string, n: number, due: string) {
  const loans = this.library.loansFor(member);
  assert.equal(loans.length, n);
  assert.equal(loans[0]!.due.toISOString().slice(0, 10), due);
});

Then('{string} owes {float}', function (this: AppWorld, member: string, amount: number) {
  assert.equal(this.library.fineFor(member), amount);
});
