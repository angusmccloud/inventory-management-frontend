"use client";
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from '@/components/common/PageContainer/PageContainer';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import { Card } from '@/components/common/Card/Card';
import { ToggleButton } from '@/components/common/ToggleButton/ToggleButton';
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';
import notificationsApi from '@/lib/api/notifications';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { getErrorMessage } from '@/lib/api-client';
import { useSnackbar } from '@/contexts/SnackbarContext';

const NOTIFICATION_TYPES = [
  { key: 'LOW_STOCK', label: 'Low Stock' },
  { key: 'SUGGESTION', label: 'Suggestion' },
];
const CHANNELS = ['EMAIL', 'IN_APP'];
const EMAIL_FREQUENCIES = [
  { value: 'IMMEDIATE', label: 'Real-time' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
];

type Props = {
  familyId?: string;
  memberId?: string;
};

export default function NotificationsClient(props: Props = {}) {
  const searchParams = useSearchParams();
  const familyId = props.familyId ?? searchParams.get('familyId') ?? '';
  const memberId = props.memberId ?? searchParams.get('memberId') ?? '';
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [preferences, setPreferences] = React.useState<any[]>([]);
  const [unsubscribeAllEmail, setUnsubscribeAllEmail] = React.useState(false);

  React.useEffect(() => {
    if (!familyId || !memberId) {
      return;
    }
    setLoading(true);
    notificationsApi
      .getPreferences(familyId, memberId)
      .then((data) => {
        const defaultFrequency = data?.defaultFrequency ?? 'DAILY';
        const prefs = (data?.preferences || []).map((p: any) => ({
          ...p,
          entries: (p.entries || []).map((e: any) => {
            const freq = e.frequency ?? [];
            const freqs = Array.isArray(freq)
              ? freq
              : String(freq || '')
                  .split(',')
                  .map((part) => part.trim())
                  .filter(Boolean);
            return { ...e, frequencies: freqs.length ? freqs : [defaultFrequency] };
          }),
        }));

        // Ensure all notification types have entries
        const ensuredPrefs = NOTIFICATION_TYPES.map(type => {
          const existing = prefs.find((p: any) => p.notificationType === type.key);
          if (existing) return existing;

          // Create default entry if not exists
          return {
            notificationType: type.key,
            entries: CHANNELS.map((c) => ({ channel: c, frequencies: [defaultFrequency] }))
          };
        });

        setPreferences(ensuredPrefs);
        setUnsubscribeAllEmail(!!data?.unsubscribeAllEmail);
      })
      .catch(() => {
        // TODO: show error to user
      })
      .finally(() => setLoading(false));
  }, [familyId, memberId]);

  function handleFrequencyToggle(notificationType: string, channel: string, freq: string) {
    if (channel !== 'EMAIL') return;
    setPreferences((prev) =>
      prev.map((p) => {
        if (p.notificationType !== notificationType) return p;
        return {
          ...p,
          entries: p.entries.map((e: any) => {
            if (e.channel !== channel) return e;
            const currentFreqs = Array.isArray(e.frequencies) ? [...e.frequencies] : [];
            const idx = currentFreqs.indexOf(freq);
            if (idx === -1) {
              // Add frequency if not present
              currentFreqs.push(freq);
            } else {
              // Remove frequency if present
              currentFreqs.splice(idx, 1);
            }
            return { ...e, frequencies: currentFreqs };
          }),
        };
      })
    );
  }

  async function handleSave() {
    if (!familyId || !memberId) return;
    setSaving(true);
    try {
      const outPrefs = (preferences || []).map((p: any) => ({
        ...p,
        entries: (p.entries || []).map((e: any) => ({
          channel: e.channel,
          frequency: Array.isArray(e.frequencies) ? e.frequencies : [String(e.frequency || 'DAILY')],
        })),
      }));
      await notificationsApi.updatePreferences(familyId, memberId, outPrefs, unsubscribeAllEmail);
      showSnackbar({ variant: 'info', text: 'Notification preferences saved.' });
    } catch (err) {
      showSnackbar({ variant: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const emailEnabled = !unsubscribeAllEmail;

  // Reusable component for notification frequency checkboxes
  function FrequencyCheckboxes({
    notificationType,
    disabled
  }: {
    notificationType: string;
    disabled: boolean;
  }) {
    const row = preferences.find((p: any) => p.notificationType === notificationType) || {
      entries: CHANNELS.map((c) => ({ channel: c, frequencies: ['DAILY'] }))
    };
    const entry = row.entries?.find((e: any) => e.channel === 'EMAIL') || { frequencies: ['DAILY'] };

    return (
      <div className="flex items-center gap-3">
        {EMAIL_FREQUENCIES.map((f) => {
          const currentFrequencies = entry.frequencies || [];
          const checked = currentFrequencies.includes(f.value);
          return (
            <label
              key={f.value}
              className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  e.stopPropagation();
                  handleFrequencyToggle(notificationType, 'EMAIL', f.value);
                }}
                disabled={disabled}
                className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
              />
              <Text variant="bodySmall" className="text-text-primary">
                {f.label}
              </Text>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Notification Preferences"
        description="Manage how you receive notifications."
        action={
          <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save preferences'}
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-6">
          {/* In-App Notifications Info */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <Text variant="body" className="font-medium text-text-primary">In-App Notifications</Text>
                <Text variant="bodySmall" className="text-text-secondary">
                  In-app notifications are always active and delivered in real-time.
                </Text>
              </div>
            </div>
          </Card>

          {/* Email Settings */}
          <Card className={!emailEnabled ? 'opacity-60' : ''}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text variant="h4" className="font-semibold text-text-primary">Email Settings</Text>
                <ToggleButton
                  label="Enable Email Notifications"
                  checked={emailEnabled}
                  onChange={(v) => setUnsubscribeAllEmail(!v)}
                  size="md"
                />
              </div>

              {!emailEnabled && (
                <Text variant="bodySmall" className="text-text-secondary">
                  Email notifications disabled
                </Text>
              )}

              <div className="space-y-3 pt-2">
                {NOTIFICATION_TYPES.map((type) => (
                  <div key={type.key} className="flex items-center justify-between rounded-lg bg-surface-secondary p-3">
                    <Text variant="body" className="font-medium text-text-primary">{type.label}</Text>
                    <FrequencyCheckboxes notificationType={type.key} disabled={!emailEnabled} />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Text Message Settings - Coming Soon */}
          <Card className="opacity-60">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text variant="h4" className="font-semibold text-text-primary">Text Message Settings</Text>
                <ToggleButton
                  label="Enable Text Notifications"
                  checked={false}
                  onChange={() => {}}
                  size="md"
                  disabled
                />
              </div>

              <Text variant="bodySmall" className="text-text-secondary">
                Coming Soon
              </Text>

              <div className="space-y-3 pt-2">
                {NOTIFICATION_TYPES.map((type) => (
                  <div key={type.key} className="flex items-center justify-between rounded-lg bg-surface-secondary p-3">
                    <Text variant="body" className="font-medium text-text-primary">{type.label}</Text>
                    <div className="flex items-center gap-3">
                      {EMAIL_FREQUENCIES.map((f) => (
                        <ToggleButton
                          key={f.value}
                          label={f.label}
                          visibleLabel={f.label}
                          checked={false}
                          onChange={() => {}}
                          size="sm"
                          disabled
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>
      )}
    </PageContainer>
  );
}
