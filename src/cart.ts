export interface Product { sku: string; name: string; price: number }

export interface Line { product: Product; qty: number }

export class Catalog {
  private items = new Map<string, Product>();
  add(p: Product) { this.items.set(p.sku, p); return this; }
  get(sku: string) {
    const p = this.items.get(sku);
    if (!p) throw new Error(`unknown product ${sku}`);
    return p;
  }
}

export class Cart {
  private lines = new Map<string, Line>();
  private coupon?: string;

  constructor(private catalog: Catalog) {}

  add(sku: string, qty = 1) {
    if (qty <= 0) throw new Error('quantity must be positive');
    const product = this.catalog.get(sku);
    const line = this.lines.get(sku);
    this.lines.set(sku, { product, qty: (line?.qty ?? 0) + qty });
  }

  remove(sku: string) { this.lines.delete(sku); }

  applyCoupon(code: string) {
    if (!['WELCOME10', 'FREESHIP'].includes(code)) throw new Error('invalid coupon');
    this.coupon = code;
  }

  get count() { return [...this.lines.values()].reduce((s, l) => s + l.qty, 0); }
  get subtotal() { return round([...this.lines.values()].reduce((s, l) => s + l.qty * l.product.price, 0)); }
  get discount() { return this.coupon === 'WELCOME10' ? round(this.subtotal * 0.1) : 0; }
  get shipping() {
    if (this.count === 0) return 0;
    if (this.coupon === 'FREESHIP' || this.subtotal - this.discount >= 50) return 0;
    return 4.99;
  }
  get total() { return round(this.subtotal - this.discount + this.shipping); }
}

const round = (n: number) => Math.round(n * 100) / 100;
