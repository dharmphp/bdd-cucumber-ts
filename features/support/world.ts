import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { Cart, Catalog } from '../../src/cart.js';
import { Library } from '../../src/library.js';

export class AppWorld extends World {
  catalog = new Catalog();
  cart = new Cart(this.catalog);
  clock = new Date('2026-01-01T00:00:00Z');
  library = new Library(() => this.clock);
  error?: Error;

  constructor(opts: IWorldOptions) { super(opts); }

  attempt(fn: () => unknown) {
    this.error = undefined;
    try { fn(); } catch (e) { this.error = e as Error; }
  }
}

setWorldConstructor(AppWorld);
