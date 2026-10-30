# Shop Inventory: Specification

## Purpose
Staff record stock coming in and going out of a shop. Managers see low-stock alerts and a stock movement report so they can reorder on time.

## Roles
- **Staff**: logs in, searches products, records stock in and stock out, views movement history.
- **Manager**: logs in, adds/edits/deletes products, sees low-stock alerts, sees the stock movement report.

## Entities (first idea, used from Check 3 and 4)
- User (id, username, passwordHash, fullName, role)
- Product (id, code, name, quantity, minimumLevel)
- StockMovement (id, productId, type IN/OUT, quantity, date, reason, note, userId). One product has many movements.

## User stories

### US-01 Login
As a Staff or Manager, I want to log in so that I can use the app.

Acceptance criteria:
- With a correct username and password, I am sent to the product list.
- With a wrong username or password, I see "Invalid username or password".
- If a field is empty, I see "Username is required" or "Password is required".

### US-02 Record stock-in
As Staff, I want to record stock-in so that the stock count goes up when goods arrive.

Acceptance criteria:
- I choose a product, enter a quantity and an optional note.
- After saving, the product quantity goes up by that quantity.
- If the quantity is 0 or negative, I see "Quantity must be more than 0".
- If no product is chosen, I see "Please choose a product".

### US-03 Record stock-out
As Staff, I want to record stock-out so that the stock count goes down when goods leave.

Acceptance criteria:
- I choose a product, enter a quantity and choose a reason (sale, damaged, expired).
- After saving, the product quantity goes down by that quantity.
- If the quantity is bigger than the current stock, I see "Not enough stock".
- If the quantity is 0 or negative, I see "Quantity must be more than 0".

### US-04 Search products
As Staff, I want to search the product list so that I can find an item quickly.

Acceptance criteria:
- Typing part of a name or code filters the list.
- If nothing matches, I see "No products found".
- The list shows 10 products per page, with Previous and Next buttons.

### US-05 View movement history
As Staff, I want to see the movements of one product so that I can check what happened to its stock.

Acceptance criteria:
- The history shows date, type (IN or OUT), quantity and who recorded it.
- The newest movement is at the top.
- If there are no movements, I see "No movements yet".

### US-06 Manage products
As Manager, I want to add, edit and delete products so that the catalogue is correct.

Acceptance criteria:
- A product needs a code, a name and a minimum stock level.
- If the code already exists, I see "Product code already exists".
- Minimum stock level must be 0 or more.
- Before deleting, I must confirm in a message.

### US-07 See low-stock alerts
As Manager, I want a list of low-stock products so that I know what to reorder.

Acceptance criteria:
- A product appears in the list when its quantity is at or below its minimum level.
- A product above its minimum level does not appear.
- If nothing is low, I see "All products are above minimum stock".

### US-08 See the stock movement report
As Manager, I want a report for a date range so that I can see how much stock moved.

Acceptance criteria:
- I choose a start date and an end date.
- The report shows total in and total out for each product.
- If the end date is before the start date, I see "End date must be after start date".

## Who can do what (guard table, used in Check 5)

| Action | Staff | Manager |
|---|---|---|
| Log in | yes | yes |
| Search products, see history | yes | yes |
| Record stock in / stock out | yes | no |
| Add / edit / delete products | no | yes |
| See low-stock alerts | no | yes |
| See movement report | no | yes |

## Screens (see docs/wireframes/)
1. Login (US-01)
2. Product list with search (US-04, US-05, US-06)
3. Stock in / out form (US-02, US-03)
4. Low-stock alerts (US-07)
5. Movement report (US-08)