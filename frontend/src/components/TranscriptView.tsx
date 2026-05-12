import React from 'react';

interface TranscriptViewProps {
  transcript: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">Video Transcript</h3>
      <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
        {transcript}
      </p>
    </div>
  );
};

export default TranscriptView;
