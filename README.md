# College Canteen Order System – Queue

A full-stack DSA project. Students place orders, and the canteen serves them **first come, first served**. The orders are stored in a **circular queue** (a fixed-size array with `front` and `rear` pointers).

**Live demo:** _add your deployed link here_

## How the queue works

- **Enqueue (place order):** the new order goes to the rear slot, `(front + count) % capacity`.
- **Dequeue (serve order):** the order at `front` is removed and `front` moves forward by one, wrapping to slot 0 after the last slot.
- **Peek:** shows the next order to serve without removing it.
- **Overflow:** adding to a full queue (8 orders) is rejected.
- **Underflow:** serving from an empty queue is rejected.

| Operation | Cost |
|---|---|
| enqueue / dequeue / peek | O(1) |
| Estimated wait for an order | O(n), sum of the preparation times ahead of it |

A queue fits because the student who ordered first must be served first (FIFO). A circular array keeps dequeue O(1) without shifting elements.

## Files

```
canteen.js    CircularQueue and Canteen logic (used by server and browser)
index.html    Frontend: order form, queue line, array view
server.js     Express API
package.json
```

## Run locally

```bash
npm install
npm start      # http://localhost:3000
```

## API

| Method | Route | Body |
|---|---|---|
| GET | `/api/canteen` | – |
| POST | `/api/order` | `{ name, item }` |
| POST | `/api/serve` | – |
| POST | `/api/reset` | – |

## Deploy

Push to a public GitHub repo, then create a **Web Service** on Render with build command `npm install` and start command `npm start`. Without a backend the page falls back to "Demo mode" and runs the same code in the browser.
