
export interface DetectedObject {
  name: string;
  attributes: string[];
  estimated_role: string;
  location: string;
}

export interface EnvironmentContext {
  setting_type: string;
  time_context: string;
  mood_or_tone: string;
  activity_type: string;
}

export interface VisualQualityAnalysis {
  focus_and_sharpness: string;
  lighting: string;
  framing_and_composition: string;
  aesthetic_notes: string;
}

export interface TextInImage {
  has_text: boolean;
  transcribed_text: string;

  meaning_or_purpose: string;
}

export interface SafetyAndSensitiveContent {
  is_sensitive: boolean;
  notes: string;
}

export interface AnalysisResult {
  summary: string;
  detailed_description: string;
  objects_detected: DetectedObject[];
  environment_context: EnvironmentContext;
  visual_quality_analysis: VisualQualityAnalysis;
  text_in_image: TextInImage;
  potential_use_cases: string[];
  safety_and_sensitive_content: SafetyAndSensitiveContent;
  next_action_suggestion: string;
}
