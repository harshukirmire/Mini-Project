import { Scholarship, UserProfile, ExamRecord } from '../types';

export interface MatchResult {
  scholarship: Scholarship;
  matchScore: number; // 0 to 100
  status: 'High Match' | 'Potential Match' | 'Missing Criteria';
  reasons: {
    passed: string[];
    missing: string[];
    notes: string[];
  };
}

export function evaluateScholarshipMatch(
  scholarship: Scholarship,
  profile: UserProfile | null,
  exams: ExamRecord[]
): MatchResult {
  if (!profile) {
    return {
      scholarship,
      matchScore: 0,
      status: 'Missing Criteria',
      reasons: {
        passed: [],
        missing: ['Student profile not configured'],
        notes: ['Complete your profile to see eligibility comparison']
      }
    };
  }

  const passed: string[] = [];
  const missing: string[] = [];
  const notes: string[] = [];

  let totalPoints = 0;
  let earnedPoints = 0;

  const elig = scholarship.eligibility;

  // 1. Education Level Check
  totalPoints += 25;
  if (
    elig.educationLevels.includes(profile.currentEducationLevel) ||
    elig.educationLevels.includes('All Levels') ||
    elig.educationLevels.length === 0
  ) {
    earnedPoints += 25;
    passed.push(`Education level '${profile.currentEducationLevel}' is eligible`);
  } else {
    missing.push(
      `Requires ${elig.educationLevels.join(' or ')} (Your profile: ${profile.currentEducationLevel})`
    );
  }

  // 2. Nationality / Domicile Check
  totalPoints += 20;
  let geoMatch = true;
  if (elig.eligibleStates && elig.eligibleStates.length > 0) {
    const isStateEligible =
      elig.eligibleStates.includes('All States & UTs of India') ||
      elig.eligibleStates.includes(profile.domicileState) ||
      elig.eligibleStates.includes(profile.state);

    if (isStateEligible) {
      earnedPoints += 20;
      passed.push(`Domicile state '${profile.domicileState || profile.state}' is eligible`);
    } else {
      geoMatch = false;
      missing.push(`State specific: requires domicile in ${elig.eligibleStates.join(', ')}`);
    }
  } else if (elig.eligibleNationalities && elig.eligibleNationalities.length > 0) {
    const isNationEligible =
      elig.eligibleNationalities.includes('All international students') ||
      elig.eligibleNationalities.some((n) => n.toLowerCase().includes('all')) ||
      (profile.country === 'India' &&
        elig.eligibleNationalities.some((n) => n.toLowerCase().includes('indian')));

    if (isNationEligible) {
      earnedPoints += 20;
      passed.push(`Nationality (${profile.nationality || profile.country}) meets criteria`);
    } else {
      notes.push(`Check country list: ${elig.eligibleNationalities.join(', ')}`);
      earnedPoints += 10;
    }
  } else {
    earnedPoints += 20;
    passed.push('Open to all nationalities');
  }

  // 3. Family Annual Income Check
  if (elig.maxFamilyIncomeINR) {
    totalPoints += 25;
    const userIncome = profile.familyAnnualIncome || 0;
    if (userIncome > 0 && userIncome <= elig.maxFamilyIncomeINR) {
      earnedPoints += 25;
      passed.push(
        `Family income ₹${userIncome.toLocaleString('en-IN')} is within ceiling of ₹${elig.maxFamilyIncomeINR.toLocaleString('en-IN')}`
      );
    } else if (userIncome === 0) {
      notes.push(`Income ceiling is ₹${elig.maxFamilyIncomeINR.toLocaleString('en-IN')} (Not stated in profile)`);
      earnedPoints += 10;
    } else {
      missing.push(
        `Annual income ₹${userIncome.toLocaleString('en-IN')} exceeds limit of ₹${elig.maxFamilyIncomeINR.toLocaleString('en-IN')}`
      );
    }
  }

  // 4. Academic Marks / Percentage / CGPA Check
  if (elig.minPercentage || elig.minCGPA) {
    totalPoints += 15;
    const userPct = profile.currentPercentage || 0;
    const userCGPA = profile.currentCGPA || 0;

    let academicMet = false;
    if (elig.minPercentage && userPct >= elig.minPercentage) {
      academicMet = true;
    }
    if (elig.minCGPA && userCGPA >= elig.minCGPA) {
      academicMet = true;
    }

    if (academicMet) {
      earnedPoints += 15;
      passed.push(
        `Academic score (${userPct ? `${userPct}%` : ''} ${userCGPA ? `CGPA ${userCGPA}` : ''}) satisfies minimum cut-off`
      );
    } else {
      missing.push(
        `Requires minimum ${elig.minPercentage ? `${elig.minPercentage}%` : ''} ${elig.minCGPA ? `CGPA ${elig.minCGPA}` : ''}`
      );
    }
  }

  // 5. Gender / Category Check
  if (elig.genderEligibility && elig.genderEligibility !== 'All') {
    totalPoints += 15;
    if (profile.gender === elig.genderEligibility) {
      earnedPoints += 15;
      passed.push(`Gender requirement (${elig.genderEligibility}) satisfied`);
    } else {
      missing.push(`Exclusively for ${elig.genderEligibility} applicants`);
    }
  }

  // 6. Exam Requirement Cross-Reference
  const examReq = scholarship.examRequirement;
  if (examReq.examType === 'No separate exam required') {
    passed.push('No separate scholarship entrance examination required');
  } else if (examReq.examType === 'University admission examination') {
    // Check if user has added entrance exam
    const hasMatchingEntrance = exams.some((e) =>
      examReq.examName?.toLowerCase().includes(e.examName.toLowerCase().replace('pcm', '').replace('pcb', '').trim())
    );
    if (hasMatchingEntrance) {
      passed.push(`Entrance examination record found: ${examReq.examName}`);
      earnedPoints += 10;
      totalPoints += 10;
    } else {
      notes.push(`Requires qualifying entrance examination (${examReq.examName || 'Admission Exam'})`);
      totalPoints += 10;
    }
  } else if (examReq.examType === 'Language proficiency test') {
    const hasLangTest = exams.some(
      (e) =>
        e.examCategory === 'Language & International' ||
        e.examName.includes('IELTS') ||
        e.examName.includes('TOEFL') ||
        e.examName.includes('HSK') ||
        e.examName.includes('TOPIK') ||
        e.examName.includes('JLPT')
    );
    if (hasLangTest) {
      passed.push(`Language test score documented in your exam profile`);
      earnedPoints += 10;
      totalPoints += 10;
    } else {
      notes.push(`Language proficiency certificate required (${examReq.examName})`);
      totalPoints += 10;
    }
  }

  const rawScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 60;
  const matchScore = Math.min(100, Math.max(15, rawScore));

  let status: MatchResult['status'] = 'Potential Match';
  if (missing.length === 0 && matchScore >= 75) {
    status = 'High Match';
  } else if (missing.length > 1 || matchScore < 50) {
    status = 'Missing Criteria';
  }

  return {
    scholarship,
    matchScore,
    status,
    reasons: {
      passed,
      missing,
      notes
    }
  };
}
