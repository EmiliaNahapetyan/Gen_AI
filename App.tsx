
import React, { useState, useCallback } from 'react';
import { analyzeImage } from './services/geminiService';
import type { AnalysisResult } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeImage(base64Image, imageFile.type, language);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`);
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Gemini Image Analyzer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Upload an image to get a deep, structured analysis from Gemini.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} />
            
            <div className="flex justify-center p-1 rounded-lg bg-gray-800 border border-gray-700">
              <button
                onClick={() => setLanguage('English')}
                className={`px-4 py-2 text-sm font-medium rounded-md w-full transition-colors duration-200 ${language === 'English' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700/50'}`}
                aria-pressed={language === 'English'}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('Armenian')}
                className={`px-4 py-2 text-sm font-medium rounded-md w-full transition-colors duration-200 ${language === 'Armenian' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700/50'}`}
                aria-pressed={language === 'Armenian'}
              >
                Armenian
              </button>
            </div>

            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl min-h-[300px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center">
                <Loader large={true} />
                <p className="mt-4 text-gray-300">Performing deep analysis...</p>
              </div>
            )}
            {error && <ErrorDisplay message={error} />}
            {analysisResult && <AnalysisDisplay result={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
              <div className="text-center text-gray-500">
                <p className="text-xl">Analysis results will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
