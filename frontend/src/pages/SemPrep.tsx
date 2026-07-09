import React, { useState } from 'react';
import api from '../utils/api';
import { Upload, FileText, Loader2, BookOpen, AlertCircle } from 'lucide-react';

interface Question {
  question: string;
  marks: number;
  topic: string;
}

interface Section {
  title: string;
  questions: Array<Question>;
}

interface GeneratedPaper {
  sections: Array<Section>;
}

interface SemPrepData {
  _id: string;
  title: string;
  generatedPaper: GeneratedPaper;
}

const SemPrep = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SemPrepData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || !title) {
      setError('Please provide a title and at least one file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await api.post('/api/semprep/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate question paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Semester Preparation</h1>
        <p className="text-slate-600">Upload your PYQs and syllabus to generate a probable question paper.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Subject Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures and Algorithms"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Upload PDF/Images (PYQs & Syllabus)</label>
            <div className="relative group">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 group-hover:border-blue-500 transition-colors bg-slate-50">
                <Upload className="text-slate-400 group-hover:text-blue-500" size={32} />
                <span className="text-slate-600">
                  {files ? `${files.length} files selected` : 'Click or drag files here'}
                </span>
                <span className="text-xs text-slate-400">PDF, PNG, JPG supported</span>
              </div>
            </div>
            {files && (
              <div className="mt-2 space-y-1">
                {Array.from(files).map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText size={16} className="text-blue-500" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Probable Questions'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">{result.title}</h2>
            <p className="text-slate-500">Probable Question Paper</p>
          </div>

          {result.generatedPaper.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-2">
                <BookOpen size={24} />
                {section.title}
              </h3>
              <div className="space-y-6">
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} className="group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-lg text-slate-800 leading-relaxed">
                          <span className="font-semibold text-slate-400 mr-2">{qIdx + 1}.</span>
                          {q.question}
                        </p>
                        {q.topic && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">
                            {q.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-3 py-1 rounded-full">
                        {q.marks} Marks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-all"
            >
              Print Question Paper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemPrep;
