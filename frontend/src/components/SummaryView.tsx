import React from 'react';
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
});

interface SummaryViewProps {
  summary: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  const htmlContent = DOMPurify.sanitize(md.render(summary));

  return (
    <div className="prose prose-slate prose-blue max-w-none">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default SummaryView;
