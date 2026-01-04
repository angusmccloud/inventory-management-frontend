/**
 * Public Terms of Use page - accessible before login
 */

'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PageContainer, Text } from '@/components/common';

export default function PublicTermsPage() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    fetch('/terms.md')
      .then((r) => r.text())
      .then((md) => {
        if (mounted) setContent(md);
      })
      .catch(() => {
        if (mounted) setContent('Failed to load terms.');
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
