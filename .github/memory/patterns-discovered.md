# Patterns Discovered

This file stores accumulated learnings over time.

Use each entry to document repeatable coding or debugging patterns that improve implementation speed, reliability, and consistency.

## Pattern Template

### Pattern Name

### Context
- Where this pattern applies.

### Problem
- What issue repeatedly appears.

### Solution
- The approach that consistently resolves the issue.

### Example
```js
// Provide a minimal code example showing the pattern.
```

### Related Files
- Path(s) where this pattern was observed or implemented.

---

## Example Pattern

### Pattern Name
Service initialization: prefer empty array over null

### Context
- Service setup and initialization defaults in backend modules.
- Code paths that iterate service-managed collections.

### Problem
- Using null as an initial collection value requires repeated null checks.
- Missed guards can trigger runtime errors when calling array methods.

### Solution
- Initialize collection state to an empty array.
- Keep downstream logic array-based so iteration and length checks are safe by default.

### Example
```js
// Less safe
let jobs = null;

// Safer default
let jobs = [];

// Downstream usage remains straightforward
for (const job of jobs) {
  processJob(job);
}
```

### Related Files
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js
