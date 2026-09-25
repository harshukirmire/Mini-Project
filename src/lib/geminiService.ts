import { GoogleGenAI } from '@google/genai';
import { Scholarship, UserProfile, ExamRecord, ApplicationRecord } from '../types';

interface GuideQueryContext {
  studentProfile?: UserProfile | null;
  examRecords?: ExamRecord[];
  applications?: ApplicationRecord[];
  activeScholarship?: Scholarship | null;
}

export async function askSynoraGuide(
  userQuestion: string,
  contextData?: GuideQueryContext
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "Synora Guide AI is currently in offline verified mode. (GEMINI_API_KEY is not configured in this environment). You can still browse all verified official scholarship deadlines, exam requirements, and procedures directly in the tabs above.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Strict Grounding System Prompt
    const systemInstruction = `
You are SYNORA GUIDE AI, an expert, factual, and strictly verified scholarship advisor for the SYNORA web application.
Your mission is to help students understand official scholarship rules, entrance exam criteria, required documentation, and deadlines.

CRITICAL DATA INTEGRITY & ANTI-FABRICATION RULES:
1. NEVER fabricate scholarship names, deadlines, exam requirements, minimum scores, application fees, or URLs.
2. If you do not have verified knowledge or if information is not clearly specified, state clearly: "I don't have verified information for that requirement. Please refer to the official portal linked above."
3. Distinguish clearly between:
   - "Scholarship-specific examination"
   - "University admission examination" (e.g. MHT-CET, JEE Main, NEET)
   - "Language proficiency test" (e.g. IELTS, TOEFL, HSK, TOPIK, JLPT)
   - "No separate scholarship examination required"
4. If asked about user status, refer politely to their authenticated profile, active exams, or saved applications if provided in the context.
5. Provide crisp, structured bullet points with clear next steps. Keep tone professional, encouraging, and minimal.
`;

    let contextPrompt = '';
    if (contextData?.activeScholarship) {
      const s = contextData.activeScholarship;
      contextPrompt += `
ACTIVE VIEWED SCHOLARSHIP DATA:
- Name: ${s.name}
- Provider: ${s.provider} (${s.providerType})
- Country/Region: ${s.country} (${s.region || ''})
- Level: ${s.studyLevel.join(', ')}
- Funding: ${s.fundingType} — ${s.fundingAmountDescription}
- Deadline: ${s.deadline} (Verified: ${s.isDeadlineVerified})
- Exam Requirement: [${s.examRequirement.examType}] - ${s.examRequirement.examName || 'None'}
- Exam Details: ${s.examRequirement.purpose || ''} (Min Score: ${s.examRequirement.minimumScore || 'Not specified'})
- Official Website: ${s.officialWebsite}
- Application Portal: ${s.officialApplicationPortal || 'See official site'}
- Required Documents: ${s.documents.map(d => `${d.name} (${d.required ? 'Mandatory' : 'Optional'})`).join('; ')}
- Application Steps: ${s.procedure.map(p => `Step ${p.stepNumber}: ${p.title} - ${p.description}`).join(' | ')}
`;
    }

    if (contextData?.studentProfile) {
      const p = contextData.studentProfile;
      contextPrompt += `
AUTHENTICATED STUDENT CONTEXT:
- Name: ${p.fullName || 'Student'}
- Current Level: ${p.currentEducationLevel} (${p.currentDegree || ''})
- Domicile / State: ${p.domicileState || p.state}
- Category: ${p.category || 'General'}
- Annual Income: ${p.familyAnnualIncome ? `₹${p.familyAnnualIncome}` : 'Not provided'}
- Percentage / CGPA: ${p.currentPercentage ? `${p.currentPercentage}%` : ''} ${p.currentCGPA ? `CGPA ${p.currentCGPA}` : ''}
`;
    }

    if (contextData?.examRecords && contextData.examRecords.length > 0) {
      contextPrompt += `
STUDENT EXAM RECORDS:
${contextData.examRecords.map(e => `- ${e.examName} (${e.year}): ${e.percentile ? `Percentile ${e.percentile}` : ''} ${e.score ? `Score ${e.score}` : ''} ${e.rank ? `Rank ${e.rank}` : ''}`).join('\n')}
`;
    }

    if (contextData?.applications && contextData.applications.length > 0) {
      contextPrompt += `
STUDENT APPLICATION TRACKER ENTRIES:
${contextData.applications.map(a => `- ${a.scholarshipName}: Status = ${a.status} (Deadline: ${a.deadline})`).join('\n')}
`;
    }

    const fullPrompt = `${contextPrompt}\n\nUSER QUESTION: ${userQuestion}\n\nProvide an accurate, verified, structured response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature to maximize factual precision
      }
    });

    return response.text || "I was unable to generate an answer at this time. Please check your network or try again.";
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    return `Unable to query Synora Guide AI: ${error?.message || 'Service unavailable'}. Please refer to the verified information displayed on the scholarship portal.`;
  }
}
