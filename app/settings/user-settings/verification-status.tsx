'use client';

import { Card } from '@/components/common/Card/Card';
import { Text } from '@/components/common/Text/Text';

export type VerificationStatusProps = {
  ticket: { ticketId: string; expiresAt: string } | null;
};

export default function VerificationStatus({ ticket }: VerificationStatusProps) {
  if (!ticket) {
    return null;
  }

  const expiresAt = new Date(ticket.expiresAt).toLocaleString();

  return (
    <Card>
      <div className="space-y-2">
        <Text variant="h4" className="text-text-primary">Email Verification Pending</Text>
        <Text variant="bodySmall" className="text-text-secondary">
          Check your inbox for a verification link. This link expires on {expiresAt}.
        </Text>
        <Text variant="bodySmall" className="text-text-secondary">
          Ticket ID: {ticket.ticketId}
        </Text>
      </div>
    </Card>
  );
}
