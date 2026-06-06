export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-label="Loading">
      <svg
        className="loading-logo logo-animated"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect className="logo-bar" x="2" y="14" width="4" height="8" rx="1.3" fillOpacity=".4" />
        <rect className="logo-bar" x="8" y="9" width="4" height="13" rx="1.3" fill="#22D3EE" fillOpacity=".7" />
        <rect className="logo-bar" x="14" y="4" width="4" height="18" rx="1.3" fill="#22D3EE" />
        <rect className="logo-bar" x="20" y="12" width="4" height="10" rx="1.3" fillOpacity=".4" />
      </svg>
      <span className="loading-label">Loading</span>
    </div>
  );
}
