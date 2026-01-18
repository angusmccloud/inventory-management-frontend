import { Suspense } from 'react';
import NotificationsClient from './NotificationsClient';

export default function Page() {
  return (
    <Suspense fallback={<div /> }>
      <NotificationsClient />
    </Suspense>
  );
}
