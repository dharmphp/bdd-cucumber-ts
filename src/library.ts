export interface Book { isbn: string; title: string; copies: number }

export interface Loan { isbn: string; member: string; due: Date }

export class Library {
  private books = new Map<string, Book>();
  private loans: Loan[] = [];
  private fines = new Map<string, number>();

  constructor(private today: () => Date = () => new Date()) {}

  addBook(book: Book) { this.books.set(book.isbn, book); }

  available(isbn: string) {
    const book = this.books.get(isbn);
    if (!book) return 0;
    return book.copies - this.loans.filter((l) => l.isbn === isbn).length;
  }

  loansFor(member: string) { return this.loans.filter((l) => l.member === member); }

  borrow(member: string, isbn: string, days = 14): Loan {
    if (!this.books.has(isbn)) throw new Error('no such book');
    if (this.available(isbn) === 0) throw new Error('no copies available');
    if (this.loansFor(member).length >= 3) throw new Error('loan limit reached');
    if ((this.fines.get(member) ?? 0) > 0) throw new Error('outstanding fines');
    const due = new Date(this.today());
    due.setDate(due.getDate() + days);
    const loan = { isbn, member, due };
    this.loans.push(loan);
    return loan;
  }

  giveBack(member: string, isbn: string) {
    const i = this.loans.findIndex((l) => l.member === member && l.isbn === isbn);
    if (i < 0) throw new Error('not on loan');
    const [loan] = this.loans.splice(i, 1);
    const lateDays = Math.max(0, Math.ceil((this.today().getTime() - loan!.due.getTime()) / 86_400_000));
    const fine = lateDays * 0.5;
    if (fine) this.fines.set(member, (this.fines.get(member) ?? 0) + fine);
    return fine;
  }

  payFine(member: string, amount: number) {
    this.fines.set(member, Math.max(0, (this.fines.get(member) ?? 0) - amount));
  }

  fineFor(member: string) { return this.fines.get(member) ?? 0; }
}
