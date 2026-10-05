/* College canteen: orders are served first come, first served (a queue).
   Works in Node (require) and in the browser (<script>). */
(function (root) {
  const MENU = {
    'Tea': { min: 2, price: 10 }, 'Samosa': { min: 3, price: 15 },
    'Cold Coffee': { min: 3, price: 35 }, 'Sandwich': { min: 4, price: 40 },
    'Idli (3 pcs)': { min: 4, price: 30 }, 'Masala Dosa': { min: 6, price: 50 },
    'Fried Rice': { min: 7, price: 70 }, 'Veg Biryani': { min: 8, price: 80 }
  };

  // Circular array queue: `front` is where we remove, (front + count) % cap is where we add.
  class CircularQueue {
    constructor(cap) { this.cap = cap; this.buf = new Array(cap).fill(null); this.front = 0; this.count = 0; }
    get rear() { return (this.front + this.count - 1 + this.cap) % this.cap; }   // index of last item
    isEmpty() { return this.count === 0; }
    isFull() { return this.count === this.cap; }
    enqueue(x) {
      if (this.isFull()) throw new Error('Queue is full (overflow): serve an order before adding another.');
      this.buf[(this.front + this.count) % this.cap] = x;
      this.count++;
    }
    dequeue() {
      if (this.isEmpty()) throw new Error('Queue is empty (underflow): there are no orders to serve.');
      const x = this.buf[this.front];
      this.buf[this.front] = null;
      this.front = (this.front + 1) % this.cap;    // wraps around to slot 0
      this.count--;
      return x;
    }
    peek() { return this.isEmpty() ? null : this.buf[this.front]; }
    toArray() { return Array.from({ length: this.count }, (_, i) => this.buf[(this.front + i) % this.cap]); }
  }

  class Canteen {
    constructor() { this.reset(); }

    reset() {
      this.q = new CircularQueue(8);
      this.seq = 1;
      this.served = [];
      [['Priya', 'Masala Dosa'], ['Arjun', 'Tea'], ['Meena', 'Veg Biryani']]
        .forEach(([name, item]) => this.order({ name, item }));
      this.last = { op: 'reset', cost: 'O(1)', detail: 'Canteen reopened with 3 orders' };
    }

    order({ name, item }) {
      name = String(name || '').trim().slice(0, 20);
      if (!name) throw new Error('Enter the student name');
      if (!Object.prototype.hasOwnProperty.call(MENU, item)) throw new Error('Pick an item from the menu');
      const o = { token: this.seq, name, item, prep: MENU[item].min, price: MENU[item].price };
      this.q.enqueue(o);                           // throws if the queue is full
      this.seq++;
      this.last = { op: 'enqueue (place order)', cost: 'O(1)', detail: `Token ${o.token} joined at the rear, slot ${this.q.rear}` };
    }

    serve() {
      const o = this.q.dequeue();                  // throws if the queue is empty
      this.served = [o, ...this.served].slice(0, 5);
      this.last = { op: 'dequeue (serve order)', cost: 'O(1)', detail: `Token ${o.token} left from the front` };
    }

    state() {
      let t = 0;
      const line = this.q.toArray().map((o, i) => { t += o.prep; return { ...o, position: i + 1, wait: t }; });
      return {
        line, slots: this.q.buf.map(o => (o ? o.token : null)),
        front: this.q.front, rear: this.q.isEmpty() ? null : this.q.rear,
        size: this.q.count, cap: this.q.cap, served: this.served, last: this.last, menu: MENU
      };
    }
  }

  const api = { CircularQueue, Canteen };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CanteenLib = api;
})(this);
