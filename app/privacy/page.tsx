/**
 * Public Privacy Policy page - accessible before login
 */

'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PageContainer, Text } from '@/components/common';

export default function PublicPrivacyPage() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    fetch('/privacy.md')
      .then((r) => r.text())
      .then((md) => {
        if (mounted) setContent(md);
      })
      .catch(() => {
        if (mounted) setContent('Failed to load privacy policy.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageContainer>
      <div className="prose prose-sm prose-invert mt-6 rounded-lg border border-border bg-surface p-6">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <Text variant="body">Loading...</Text>
        )}
      </div>
    </PageContainer>
  );
}
