export interface Subject {
  id: number;
  object: string;
  assignments: {
    srs_stage: number;
  };
}

export interface RawReview {
  id: string;
  object: string;
  url: string;
  data_updated_at: string;
  data: {
    created_at: string;
    assignment_id: string;
    spaced_repetition_system_id: string;
    subject_id: string;
    starting_srs_stage: string;
    ending_srs_stage: string;
    incorrect_meaning_answers: string;
    incorrect_reading_answers: string;
  };
}

export interface ReviewCollection {
  object: string;
  url: string;
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
  data_updated_at: string;
  data: RawReview[];
}

export interface Review {
  subject_id: string;
  started: Date;
  duration: number; // milliseconds
  questions: number;
  reading_incorrect: number;
  meaning_incorrect: number;
}

export interface Session {
  questions: number;
  reading_incorrect: number;
  meaning_incorrect: number;
  startTime: Date;
  endTime: Date;
  reviews: Review[];
}

export interface SessionSummary {
  start: Date;
  end: Date;
  reviewCount: number;
  questionCount: number;
  correctAnswerCount: number;
}

export interface ReviewCount {
  review_count: number; // Number of items reviewed (R+K+V)
  question_count: number; // Number of questions (reading & meaning + repeats for misses)
  accuracy: number; // Percent of items answered correctly the first time (reading & meaning)
  reading_accuracy: number; // Percent of items with reading answered corretly the first time
  meaning_accuracy: number; // percent of items with meaning answered correctly the first time
  start: Date; // start time of the first review
  end: Date; // start time of the final review in the session or day
}
