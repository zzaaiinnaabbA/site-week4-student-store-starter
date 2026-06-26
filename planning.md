# Student Store API - System Specification


## Section 1: Data Models

Product Model

Fields:
- id: Int, required, primary key, auto-increments
- name: String, required
- category: String, required
- image: String, required (URL to product image)
- description: String, required
- price: Float, required
- createdAt: DateTime, required, defaults to current timestamp
- updatedAt: DateTime, required, auto-updates on record change

Primary Key: id (auto-increment)
Relationships:
- Has many OrderItem records (one product can appear in multiple order items)

Cascade Behavior:
- When a Product is deleted, all associated OrderItem records must also be deleted. This prevents orphaned order items that reference non-existent products.

---

Order Model

Fields:
- id: Int, required, primary key, auto-increments
- customerName: String, required
- customerEmail: String, required
- status: String, required, defaults to "pending"
- total: Float, required
- createdAt: DateTime, required, defaults to current timestamp
- updatedAt: DateTime, required, auto-updates on record change

Primary Key: id (auto-increment)

Relationships:
- Has many OrderItem records (one order contains multiple items)

Cascade Behavior:
- When an Order is deleted, all associated OrderItem records must also be deleted. This ensures that order items don't exist without a parent order.

---

OrderItem Model

Fields:
- id: Int, required, primary key, auto-increments
- orderId: Int, required, foreign key to Order
- productId: Int, required, foreign key to Product
- quantity: Int, required
- price: Float, required (snapshot of product price at time of order)
- createdAt: DateTime, required, defaults to current timestamp

Primary Key: id (auto-increment)

Relationships:
- Belongs to one Order (via orderId foreign key)
- Belongs to one Product (via productId foreign key)

Cascade Behavior:
- OrderItem is a child of both Order and Product
- If the parent Order is deleted, this OrderItem is deleted
- If the parent Product is deleted, this OrderItem is deleted
- OrderItem records should never exist without both a valid Order and Product

---

## Section 2: API Contract

Error Response Shape (used across all endpoints):
{ "error": "error message here" }

---

GET /products

Purpose: Retrieve all products from the store

Request:
- Method: GET
- Path: /products
- Body: none
- Query params: category (clothing), sort (price)
- Route params: none

Success Response:
- Status: 200
- Body: { "products": [array of product objects] }

Error Cases:
- Status: 500
- Body: { "error": "Failed to fetch products" }

---

GET /products/:id

Purpose: Retrieve a single product by ID

Request:
- Method: GET
- Path: /products/:id
- Body: none
- Query params: none
- Route params: id (product ID)

Success Response:
- Status: 200
- Body: { "product": {product object} }

Error Cases:
- Status: 404
- Body: { "error": "Product not found" }

- Status: 500
- Body: { "error": "Failed to fetch product" }

---

POST /products

Purpose: Create a new product

Request:
- Method: POST
- Path: /products
- Body: {
    "name": "string",
    "category": "string",
    "image": "string",
    "description": "string",
    "price": number
  }
- Query params: none
- Route params: none

Success Response:
- Status: 201
- Body: { "product": {created product object} }

Error Cases:
- Status: 400
- Body: { "error": "Missing required fields" }

- Status: 500
- Body: { "error": "Failed to create product" }

---

PUT /products/:id

Purpose: Update an existing product

Request:
- Method: PUT
- Path: /products/:id
- Body: {
    "name": "string" (optional),
    "category": "string" (optional),
    "image": "string" (optional),
    "description": "string" (optional),
    "price": number (optional)
  }
- Query params: none
- Route params: id (product ID)

Success Response:
- Status: 200
- Body: { "product": {updated product object} }

Error Cases:
- Status: 404
- Body: { "error": "Product not found" }

- Status: 500
- Body: { "error": "Failed to update product" }

---

DELETE /products/:id

Purpose: Delete a product (cascades to OrderItem records)

Request:
- Method: DELETE
- Path: /products/:id
- Body: none
- Query params: none
- Route params: id (product ID)

Success Response:
- Status: 200
- Body: { "message": "Product deleted successfully" }

Error Cases:
- Status: 404
- Body: { "error": "Product not found" }

- Status: 500
- Body: { "error": "Failed to delete product" }

---

GET /orders

Purpose: Retrieve all orders with their items

Request:
- Method: GET
- Path: /orders
- Body: none
- Query params: none
- Route params: none

Success Response:
- Status: 200
- Body: { "orders": [array of order objects with nested items] }

Error Cases:
- Status: 500
- Body: { "error": "Failed to fetch orders" }

---

GET /orders/:id

Purpose: Retrieve a single order with its items

Request:
- Method: GET
- Path: /orders/:id
- Body: none
- Query params: none
- Route params: id (order ID)

Success Response:
- Status: 200
- Body: { "order": {order object with nested items array} }

Error Cases:
- Status: 404
- Body: { "error": "Order not found" }

- Status: 500
- Body: { "error": "Failed to fetch order" }

---

POST /orders

Purpose: Create a new order with multiple order items (transactional)

Request:
- Method: POST
- Path: /orders
- Body: {
    "customerName": "string",
    "customerEmail": "string",
    "status": "string" (optional, defaults to "pending"),
    "items": [
      {
        "productId": number,
        "quantity": number
      }
    ]
  }
- Query params: none
- Route params: none

Success Response:
- Status: 201
- Body: {
    "order": {
      "id": number,
      "customerName": "string",
      "customerEmail": "string",
      "status": "string",
      "total": number,
      "createdAt": "ISO timestamp",
      "updatedAt": "ISO timestamp",
      "items": [
        {
          "id": number,
          "orderId": number,
          "productId": number,
          "quantity": number,
          "price": number,
          "createdAt": "ISO timestamp"
        }
      ]
    }
  }

Error Cases:
- Status: 400
- Body: { "error": "Missing required fields" }

- Status: 404
- Body: { "error": "Product with id X not found" }

- Status: 500
- Body: { "error": "Failed to create order" }

---

PUT /orders/:id

Purpose: Update an existing order (status or customer info only, not items)

Request:
- Method: PUT
- Path: /orders/:id
- Body: {
    "customerName": "string" (optional),
    "customerEmail": "string" (optional),
    "status": "string" (optional)
  }
- Query params: none
- Route params: id (order ID)

Success Response:
- Status: 200
- Body: { "order": {updated order object} }

Error Cases:
- Status: 404
- Body: { "error": "Order not found" }

- Status: 500
- Body: { "error": "Failed to update order" }

---

DELETE /orders/:id

Purpose: Delete an order (cascades to OrderItem records)

Request:
- Method: DELETE
- Path: /orders/:id
- Body: none
- Query params: none
- Route params: id (order ID)

Success Response:
- Status: 200
- Body: { "message": "Order deleted successfully" }

Error Cases:
- Status: 404
- Body: { "error": "Order not found" }

- Status: 500
- Body: { "error": "Failed to delete order" }

---





## Section 3: Transactional Flow

POST /orders Transaction Flow

Step 1: Request arrives
The client sends a request body containing:
- customerName: the name of the customer placing the order
- customerEmail: the email of the customer
- status: optional order status (defaults to "pending" if not provided)
- items: an array where each item has a productId and quantity

Example request body:
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "status": "pending",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}

Step 2: Validate the items array
Before starting any database operations, verify that the items array exists and is not empty. If it's missing or empty, return a 400 error immediately.

Step 3: Begin a Prisma transaction
All subsequent database operations must happen inside a single transaction. This ensures that if any step fails, all changes are rolled back and the database stays consistent.

Step 4: Fetch all referenced products
For each item in the items array, we need to look up the corresponding Product record to get its current price. We fetch all products by their IDs in one query.

If any productId in the request doesn't match an existing Product, the transaction should fail and return a 404 error indicating which product was not found.

Step 5: Calculate the total price
For each item, multiply the product's current price by the requested quantity. Sum these amounts to get the order total.

Step 6: Create the Order record
Insert a new Order record with:
- customerName from request
- customerEmail from request
- status from request (or "pending" if not provided)
- total calculated in step 5
- createdAt and updatedAt set automatically

Step 7: Create OrderItem records
For each item in the request, create an OrderItem record with:
- orderId: the ID of the newly created Order
- productId: from the request item
- quantity: from the request item
- price: the current price of the product (snapshot from step 4)
- createdAt set automatically

All OrderItem records must be created successfully. If creating any single OrderItem fails, the entire transaction rolls back and no Order or OrderItem records are persisted.

Step 8: Fetch the complete order with items
Query the database for the newly created Order and include all its associated OrderItem records in the response.

Step 9: Return the success response
If all steps succeed, commit the transaction and return a 201 status with the complete order object including its items array.

---

Error Scenarios

Scenario 1: Missing items array
- Response: 400 status with error message "items array is required"
- No database operations are attempted

Scenario 2: Product does not exist
- One or more productId values in the items array don't match existing products
- Transaction is rolled back before creating any records
- Response: 404 status with error message "Product with id X not found"

Scenario 3: Database failure during Order creation
- Transaction is rolled back
- No Order or OrderItem records are created
- Response: 500 status with error message "Failed to create order"

Scenario 4: Database failure during OrderItem creation
- Transaction is rolled back
- The Order record that was created in step 6 is discarded
- No OrderItem records are created
- Response: 500 status with error message "Failed to create order"

---

Why Transactions Matter

Without a transaction, a failure during step 7 (creating OrderItems) would leave an Order record in the database with no items and an incorrect total. This violates data integrity because:
- The order total wouldn't match the actual items
- The customer would see an order that appears empty
- Manual cleanup would be required to fix the orphaned Order

By wrapping steps 6 and 7 in a transaction, we guarantee atomicity: either the entire order is created successfully with all its items, or nothing is persisted at all.

---

## Spec Reconciliation — Milestone 4 (Schema Audit)

### Schema vs. spec gaps found
- No gaps found — schema matched spec exactly
- All fields from planning.md Data Models section are present in schema.prisma
- Field types and modifiers (@id, @default, etc.) match the specification

### Relationships implemented
- Product has many OrderItems (one-to-many)
- Order has many OrderItems (one-to-many)
- OrderItem belongs to one Order and one Product (many-to-one for both)
- Relationship fields use proper Prisma syntax with @relation annotations

### Cascade delete verification
- Deleting a Product removes associated OrderItems: ✅ onDelete: Cascade configured
- Deleting an Order removes associated OrderItems: ✅ onDelete: Cascade configured
- Both cascade rules prevent orphaned OrderItem records as specified

---

## Decisions Log — Milestones 1 & 5 Implementation Changes

### Milestone 1: Initial Planning
**Original approach:**
- Planned to use raw SQL queries with a traditional SQL database setup
- Considered storing total price as client-provided data in POST /orders
- Planned simple CRUD operations without transaction considerations
- Expected to manually handle cascade deletes with SQL triggers

**Initial schema concepts:**
- order_id as primary key name (snake_case convention)
- customer_id instead of separate customerName and customerEmail fields
- Considered order_items as a simple join table without price snapshots

### Milestone 5: Final Implementation
**What changed and why:**

**1. Adopted Prisma ORM instead of raw SQL**
- **Why:** Prisma provides type safety, automatic migrations, and built-in transaction support
- **Impact:** Cleaner code, fewer SQL injection vulnerabilities, easier cascade delete management
- **Tradeoff:** Added dependency and learning curve, but development speed increased significantly

**2. Changed Order schema field names**
- **From:** `order_id`, `customer_id`
- **To:** `id`, `customerName`, `customerEmail`
- **Why:** Prisma conventions use `id` for primary keys; splitting customer into name/email is more flexible than a single customer_id foreign key (no separate Customer table needed for this project scope)

**3. Server-side price calculation**
- **From:** Client sends total price with order
- **To:** Server calculates total from current product prices
- **Why:** Security - prevents price manipulation attacks where clients could submit $0.01 for expensive items
- **Impact:** Added product lookup step in transaction flow

**4. Price snapshot in OrderItem**
- **Added:** `price` field to OrderItem to capture product price at order time
- **Why:** Product prices can change over time; order items should reflect historical prices
- **Example:** If a hoodie costs $45 today but increases to $55 next week, past orders should still show $45

**5. Transactional order creation**
- **From:** Planned simple sequential operations
- **To:** Wrapped Order + OrderItems creation in Prisma `$transaction`
- **Why:** Prevents partial orders (Order created but OrderItems fail) which would corrupt data integrity
- **Implementation detail:** All-or-nothing guarantee - if any item's product is not found, entire order creation rolls back

**6. Cascade delete with Prisma relations**
- **From:** Planned SQL triggers for cascade behavior
- **To:** Used Prisma's `onDelete: Cascade` in relation definitions
- **Why:** Declarative approach, automatically generated in migrations, easier to understand and maintain

### What I would do differently if starting from scratch
- **Start with Prisma from Milestone 1:** Would have saved time migrating from initial raw SQL plans
- **Plan for price snapshots earlier:** Had to revise OrderItem schema once I realized prices change
- **Design API contract with frontend in mind:** The email vs dorm_number mismatch could have been avoided with earlier frontend/backend alignment

---

## Decisions Log — Order Creation Transaction

### What my Transactional Flow spec got right
- The step-by-step order of operations was accurate: fetch products, calculate total, create Order, create OrderItems
- The error cases (missing items, product not found) were well-documented
- The requirement for atomicity was clear - either everything succeeds or nothing persists

### What the spec missed that I discovered during implementation
- Needed to validate that items array is not empty (added 400 error check)
- Needed to validate each item has both productId and quantity fields
- The spec mentioned calculating total but didn't specify it should be calculated from current product prices (not sent by client)
- Total is now server-calculated, not client-provided, preventing price manipulation

### How the transaction error handling works
Prisma's `$transaction` wraps all database operations in a single atomic unit. If any operation inside the transaction throws an error (like a product not found), Prisma automatically rolls back all changes made within that transaction. This means if we create an Order but fail to create an OrderItem, the Order creation is undone. The database remains consistent - we never have partial orders.

### One thing I'd design differently if starting over
Instead of requiring clients to send `total` in the request, I made the server calculate it from product prices and quantities. This is more secure and prevents clients from manipulating prices. The API contract could be updated to reflect that `total` is calculated server-side and shouldn't be in the request body.

---

## Final Spec Reconciliation: Project Complete

### Full-system audit result
- All 10 implemented endpoints match the API contract (5 Product endpoints, 5 Order endpoints)
- CORS middleware is enabled in server.js to allow frontend-backend communication
- Response structures match exactly what planning.md documented

### Gaps resolved during frontend integration
- Frontend had `dorm_number` field but backend expects `email` - updated frontend to use `customerEmail` to match API contract
- Frontend sends cart as object with productId keys, backend expects array of items - added transformation in `handleOnCheckout` to convert cart format
- All product data fields (id, name, category, image, description, price) match between frontend expectations and backend response

### What the spec enabled during this project
Having a written API contract in planning.md before implementation made it easy to:
- Build backend and frontend independently without constant coordination
- Validate that responses match expected format during testing
- Quickly identify mismatches (like email vs dorm_number) during integration
- Ensure transaction logic matched the documented flow exactly

The spec-first approach meant fewer surprises during integration - the backend was built to match the promise, and the frontend integration revealed only minor naming differences that were easy to resolve.
