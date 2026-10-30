# Decisions

- 2026-10-30: Domain = Shop inventory (Staff record stock, Manager sees alerts and report), because it is small and clear.
- 2026-10-30: Medium scope: no PDF/Excel export, no email alerts, no supplier table, to finish every check on time.
- 2026-10-30: Only 2 roles (Staff, Manager); only Staff record stock, only Manager manages products and sees reports.
- 2026-10-30: Stock can never go below zero; a stock-out bigger than current stock is rejected with "Not enough stock".
- 2026-10-30: 3 entities (User, Product, StockMovement) with one product having many movements, to meet the one-to-many requirement.
- 2026-10-30: Vue Router from the start, because the app has 5 separate screens.
- 2026-10-30: Static screens use fixed example text for now; real data comes from Pinia stores in Check 2.