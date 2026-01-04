// Re-export commonly-used Heroicons so other parts of the app can import from a single place
export {
  ShoppingCartIcon,
  UsersIcon,
  PencilIcon,
  ArchiveBoxIcon,
  TrashIcon,
  QrCodeIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

// Canonical storage/warehouse icon used in storage location lists
export function StorageLocationIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g>
        <path d="M20.15,20.24H3.85a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h16.3a1,1,0,0,1,1,1V19.24A1,1,0,0,1,20.15,20.24Zm-15.3-2h14.3V4H4.85Z" />
        <path d="M12,20.24a1,1,0,0,1-1-1V3a1,1,0,1,1,2,0V19.24A1,1,0,0,1,12,20.24Z" />
        <path d="M20.15,12.09H3.85a1,1,0,1,1,0-2h16.3a1,1,0,0,1,0,2Z" />
        <path d="M6.51,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,6.51,22.05Z" />
        <path d="M17.49,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,17.49,22.05Z" />
        <path d="M14.23,12.09a1,1,0,0,1-1-1V5.66a1,1,0,0,1,2,0v5.43A1,1,0,0,1,14.23,12.09Z" />
        <path d="M17.92,12.1a1,1,0,0,1-1-.71l-1.4-4.53a1,1,0,1,1,1.91-.59l1.4,4.53a1,1,0,0,1-.66,1.25A1,1,0,0,1,17.92,12.1Z" />
        <path d="M9.28,20.24a1,1,0,0,1-1-1V13.81a1,1,0,0,1,2,0v5.43A1,1,0,0,1,9.28,20.24Z" />
        <path d="M17.43,20.24H14.72a1,1,0,0,1-1-1V14.72a1,1,0,0,1,1-1h2.71a1,1,0,0,1,1,1v4.52A1,1,0,0,1,17.43,20.24Zm-1.71-2h.71V15.72h-.71Z" />
      </g>
    </svg>
  );
}

// Map-pin used for an individual storage location item (exact paths preserved)
export function MapPinIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
