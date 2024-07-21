# src/public

Types exposed via the web API module. These are at the top level because services may want to use or extend them.

- Only publicly-exposed types should be placed here.
- They should not import anything from outside the `public` directory.
- Any updates to these types should be updated 1:1 with the [API spec](../../openapi.json).
