/**
 * Help Page - Tabbed Help Sections
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserContext } from '@/lib/auth';
import { Input } from '@/components/common';
import { Button } from '@/components/common';
import { useSnackbar } from '@/contexts/SnackbarContext';
import ReactMarkdown from 'react-markdown';
import { PageContainer, PageHeader, Text, TabNavigation } from '@/components/common';
import type { Tab } from '@/components/common/TabNavigation/TabNavigation.types';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<string>('contact');
  const [termsContent, setTermsContent] = useState<string>('');
  const [privacyContent, setPrivacyContent] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['contact', 'privacy', 'terms'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Load terms markdown for terms tab
  useEffect(() => {
    let mounted = true;
    fetch('/terms.md')
      .then((r) => r.text())
      .then((md) => {
        if (mounted) setTermsContent(md);
      })
      .catch(() => {
        if (mounted) setTermsContent('Failed to load terms.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Load privacy markdown for privacy tab
  useEffect(() => {
    let mounted = true;
    fetch('/privacy.md')
      .then((r) => r.text())
      .then((md) => {
        if (mounted) setPrivacyContent(md);
      })
      .catch(() => {
        if (mounted) setPrivacyContent('Failed to load privacy policy.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // noop
    }
  };

  const tabs: Tab[] = [
    { id: 'contact', label: 'Contact Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Use' },
  ];

  return (
    <PageContainer>
      <PageHeader title="Help" description="Support resources and legal policies" />

      <div className="mt-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
          responsiveMode="auto"
        />

        <div className="mt-6">
          {activeTab === 'contact' && (
            <div>
              <Text variant="h3" className="mb-1 text-text-default">Contact Us</Text>
              <ContactForm />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              {privacyContent ? (
                <div className="prose prose-sm prose-invert mt-2 text-sm text-text-secondary">
                  <ReactMarkdown>{privacyContent}</ReactMarkdown>
                </div>
              ) : (
                <Text variant="bodySmall" color="secondary" className="mt-2">
                  Loading privacy policy...
                </Text>
              )}
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              {termsContent ? (
                <div className="prose prose-sm prose-invert mt-2 text-sm text-text-secondary">
                  <ReactMarkdown>{termsContent}</ReactMarkdown>
                </div>
              ) : (
                <Text variant="bodySmall" color="secondary" className="mt-2">
                  Loading terms...
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const ctx = getUserContext();
    if (ctx) {
      if (ctx.name) setName(ctx.name);
      if (ctx.email) setEmail(ctx.email);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showSnackbar({ variant: 'error', text: 'Please provide a message.' });
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (resp.ok) {
        showSnackbar({ variant: 'success', text: 'Message sent — we will respond soon.' });
        setMessage('');
      } else {
        const body = await resp.json();
        showSnackbar({ variant: 'error', text: body?.error || 'Failed to send message' });
      }
    } catch (err) {
      showSnackbar({ variant: 'error', text: 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text-primary">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full rounded-md border border-border bg-surface px-4 py-2 text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            setMessage('');
            setName('');
            setEmail('');
          }}
          className="mr-3"
        >
          Clear
        </Button>
        <Button variant="primary" size="md" loading={loading} type="submit">
          Send Message
        </Button>
      </div>
    </form>
  );
}
