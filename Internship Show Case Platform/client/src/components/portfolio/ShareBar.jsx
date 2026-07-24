import { useState } from 'react';

const ShareBar = ({ url, title = 'Intern portfolio' }) => {
  const [copied, setCopied] = useState(false);

  const absoluteUrl =
    url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this portfolio link:', absoluteUrl);
    }
  };

  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: absoluteUrl });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    copyLink();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button
        type="button"
        onClick={shareNative}
        className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface"
      >
        Share
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface"
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface"
      >
        X
      </a>
    </div>
  );
};

export default ShareBar;
