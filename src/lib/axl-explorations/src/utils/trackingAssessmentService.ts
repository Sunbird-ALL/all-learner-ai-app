/**
 * Tracking Assessment Service
 * 
 * This service provides a reusable interface to send game assessment data
 * to the backend tracking microservice API.
 * 
 * Usage:
 * ```typescript
 * import { trackingAssessmentService } from "./trackingAssessmentService";
 * 
 * await trackingAssessmentService.createAssessmentTracking({
 *   userId: 'user-123',
 *   gameKey: 'combinedLetter_te',
 *   level: 1,
 *   totalQuestions: 10,
 *   correctAnswers: 8,
 *   timeSpent: 120,
 *   assessmentSummary: [{ questionId: '1', correct: true, ... }]
 * });
 * ```
 */

import { v4 as uuidv4 } from 'uuid';

// UUID v4 generator using uuid library
function generateUUID(): string {
  return uuidv4();
}

// Backend API configuration
const TRACKING_API_BASE_URL = (process.env.REACT_APP_TRACKING_API_BASE_URL || '');
const TRACKING_API_ENDPOINT = `${TRACKING_API_BASE_URL}/assessment/create`;

export interface QuestionSummary {
  questionId: string;
  questionType: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  responseTime: number;
  complexity: string;
}

export interface CreateAssessmentData {
  userId: string;
  gameKey: string;
  gameTitle: string;
  level: number;
  language: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  timeSpent: number; // in seconds
  assessmentSummary: QuestionSummary[];
  metadata?: Record<string, any>;
  subsessionId?: string; // Optional: Use telemetry subsession ID as assessmentTrackingId
  sessionId?: string; // Optional: Use telemetry session ID as attemptId
}

export interface AssessmentTrackingPayload {
  userId: string;
  courseId: string; // Using gameKey as courseId
  contentId: string; // Using gameKey + level as contentId
  attemptId: string; // Unique attempt ID
  assessmentSummary: any[]; // Array of question summaries
  totalMaxScore: number; // Maximum possible score
  totalScore: number; // User's actual score
  lastAttemptedOn: string; // ISO date string
  timeSpent: number; // Time spent in seconds
  unitId: string; // Using level as unitId
  evaluatedBy?: 'AI' | 'Online' | 'Manual';
  submitedBy?: string;
  showFlag?: boolean;
}

class TrackingAssessmentService {
  /**
   * Create an assessment tracking record
   * 
   * @param data - Assessment data from the game
   * @returns Response from the backend API
   */
  async createAssessmentTracking(data: CreateAssessmentData): Promise<any> {
    try {
      // Use session ID if provided, otherwise generate new UUID
      const attemptId = data.sessionId || generateUUID();
      // Use subsession ID if provided, otherwise generate new UUID
      const assessmentTrackingId = data.subsessionId || generateUUID();

      // Calculate scores (1 point per correct answer)
      // If totalScore is explicitly provided, use it; otherwise calculate from correctAnswers
      const totalMaxScore = data.totalQuestions * 1;
      const totalScore = data.totalScore !== undefined ? data.totalScore : (data.correctAnswers * 1);

      // Prepare the payload according to backend DTO
      // Backend expects assessmentSummary in a nested structure for score detail table
      
      // Extract game name without language suffix (e.g., "combinedLetter_en" -> "combinedLetter")
      const gameName = data.gameKey.split('_')[0];
      
      const payload: any = {
        assessmentTrackingId: assessmentTrackingId, // Required by database
        userId: data.userId,
        courseId: gameName, // Just game name without language (e.g., "combinedLetter")
        contentId: `level${data.level}`, // Format: level1, level2, level10
        attemptId: attemptId,
        assessmentSummary: [{
          sectionId: gameName, // Game name as section (e.g., "combinedLetter", "letterGame")
          data: data.assessmentSummary.map((q, index) => ({
            item: {
              id: q.questionId,
              sectionId: q.questionType, // Game mechanic type (letterHunt, quickSight, memoryChallenge)
              maxscore: 1,
              title: `Question ${index + 1}`
            },
            pass: q.isCorrect ? 'Yes' : 'No',
            resvalues: [
              {
                userAnswer: q.userAnswer,
                correctAnswer: q.correctAnswer
              }
            ],
            duration: q.responseTime, // Duration in milliseconds
            score: q.isCorrect ? 1 : 0
          }))
        }],
        totalMaxScore: totalMaxScore,
        totalScore: totalScore,
        lastAttemptedOn: new Date().toISOString(),
        timeSpent: data.timeSpent,
        unitId: data.language, // Language code (e.g., 'en', 'te', 'kn')
        submitedBy: 'Online', // Backend defaults to 'Online' if not provided
      };

      // Send POST request to backend
      const response = await fetch(TRACKING_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tenantId': 'default-tenant', // You may want to make this configurable
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to create assessment tracking:', errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Assessment tracking created successfully:',payload );

      return result;
    } catch (error) {
      console.error('❌ Error creating assessment tracking:', error);
      // Don't throw error - we don't want to break the game flow if tracking fails
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Search for assessment tracking records
   * Returns highest score and most recent attempt for given filters
   * 
   * @param filters - Search filters
   * @returns Highest score record and recent record
   */
  async searchAssessmentTracking(filters: {
    userId?: string;
    courseId?: string;
    contentId?: string;
    unitId?: string;
  }): Promise<any> {
    try {
      const searchEndpoint = `${TRACKING_API_BASE_URL}/assessment/search`;
      
      const response = await fetch(searchEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tenantId': 'default-tenant',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error searching assessment tracking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get assessment tracking details by ID
   * 
   * @param assessmentTrackingId - The assessment tracking ID
   * @returns Assessment tracking details
   */
  async getAssessmentTrackingDetails(assessmentTrackingId: string): Promise<any> {
    try {
      const detailsEndpoint = `${TRACKING_API_BASE_URL}/assessment/read/${assessmentTrackingId}`;

      const response = await fetch(detailsEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'tenantId': 'default-tenant',
        },
      });

      if (!response.ok) {
        throw new Error(`Get details request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error getting assessment tracking details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const trackingAssessmentService = new TrackingAssessmentService();

