export function getFilter() {
  return window.location.pathname === "/my-day"
    ? "my-day"
    : window.location.pathname === "/important"
    ? "important"
    : null
}
