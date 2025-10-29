
import React from 'react';
import type { AnalysisResult } from '../types';
import Card from './Card';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="w-full h-full overflow-y-auto space-y-6 pr-2">
      <Card title="Summary">
        <p className="text-gray-300">{result.summary}</p>
      </Card>
      <Card title="Detailed Description">
        <p className="text-gray-300">{result.detailed_description}</p>
      </Card>
      <Card title="Objects Detected">
        <ul className="space-y-4">
          {result.objects_detected.map((obj, index) => (
            <li key={index} className="p-3 bg-gray-700/50 rounded-md">
              <p className="font-semibold text-purple-300">{obj.name}</p>
              <p className="text-sm text-gray-400"><strong>Role:</strong> {obj.estimated_role}</p>
              <p className="text-sm text-gray-400"><strong>Location:</strong> {obj.location}</p>
              {obj.attributes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {obj.attributes.map((attr, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-cyan-800 text-cyan-200 rounded-full">{attr}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
       <Card title="Environment Context">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><strong>Setting:</strong> {result.environment_context.setting_type}</p>
          <p><strong>Time:</strong> {result.environment_context.time_context}</p>
          <p><strong>Mood/Tone:</strong> {result.environment_context.mood_or_tone}</p>
          <p><strong>Activity:</strong> {result.environment_context.activity_type}</p>
        </div>
      </Card>
      <Card title="Visual Quality">
        <ul className="space-y-2 text-sm">
          <li><strong>Focus & Sharpness:</strong> {result.visual_quality_analysis.focus_and_sharpness}</li>
          <li><strong>Lighting:</strong> {result.visual_quality_analysis.lighting}</li>
          <li><strong>Composition:</strong> {result.visual_quality_analysis.framing_and_composition}</li>
          <li><strong>Aesthetic Notes:</strong> {result.visual_quality_analysis.aesthetic_notes}</li>
        </ul>
      </Card>
      <Card title="Text in Image">
        {result.text_in_image.has_text ? (
          <div className="space-y-2">
            <p className="font-mono p-3 bg-gray-900 rounded-md text-cyan-300">"{result.text_in_image.transcribed_text}"</p>
            <p><strong>Meaning/Purpose:</strong> {result.text_in_image.meaning_or_purpose}</p>
          </div>
        ) : (
          <p>No text detected in the image.</p>
        )}
      </Card>
       <Card title="Potential Use Cases">
        <div className="flex flex-wrap gap-2">
            {result.potential_use_cases.map((useCase, index) => (
                <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">{useCase}</span>
            ))}
        </div>
      </Card>
      <Card title="Safety & Sensitive Content">
        <p className={`font-bold ${result.safety_and_sensitive_content.is_sensitive ? 'text-red-400' : 'text-green-400'}`}>
          {result.safety_and_sensitive_content.is_sensitive ? 'Sensitive Content Potentially Detected' : 'No Sensitive Content Detected'}
        </p>
        <p className="text-sm mt-1">{result.safety_and_sensitive_content.notes}</p>
      </Card>
      <Card title="Next Action Suggestion">
         <p className="text-purple-300 italic">{result.next_action_suggestion}</p>
      </Card>
    </div>
  );
};

export default AnalysisDisplay;
