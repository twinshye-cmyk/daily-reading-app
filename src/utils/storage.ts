import { Passage, SavedWord, StudyRecord, UserProfile, GradeType, SpiderSuitTheme, MomEncouragement } from '../types';
import { PRESET_PASSAGES } from '../data/passages';

const STORAGE_KEYS = {
  PROFILES: 'daily_english_user_profiles',
  ACTIVE_PROFILE_ID: 'daily_english_active_profile_id',
  PASSAGES: 'daily_english_custom_passages',
  CURRENT_PASSAGE_ID: 'daily_english_current_id',
  SAVED_WORDS: 'daily_english_saved_words',
  STUDY_RECORDS: 'daily_english_study_records',
  SETTINGS: 'daily_english_user_settings',
  ADMIN_PIN: 'daily_english_admin_pin',
  DELETED_PROFILE_IDS: 'daily_english_deleted_profile_ids',
};

export function getDeletedProfileIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_PROFILE_IDS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markProfileAsDeleted(profileId: string): void {
  try {
    const set = getDeletedProfileIds();
    set.add(profileId);
    localStorage.setItem(STORAGE_KEYS.DELETED_PROFILE_IDS, JSON.stringify(Array.from(set)));
  } catch {}
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '1234';
  } catch {
    return '1234';
  }
}

export function setAdminPin(newPin: string): boolean {
  try {
    const sanitized = newPin.trim();
    if (sanitized.length >= 4) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, sanitized);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function verifyAdminPin(enteredPin: string): boolean {
  const currentPin = getAdminPin();
  return enteredPin.trim() === currentPin.trim();
}

export interface UserSettings {
  ttsSpeed: number; // 0.8 to 1.2
  autoAdvanceChunk: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  streakGoalDays: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  ttsSpeed: 0.95,
  autoAdvanceChunk: false,
  fontSize: 'base',
  streakGoalDays: 30,
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'user-mom',
    name: '열공마미',
    grade: '',
    targetLevel: '전체 관리 및 학습 지도',
    avatarTheme: 'spider-red',
    createdAt: new Date().toISOString(),
    isMomOrAdmin: true,
  },
];

export function cleanAndDeduplicateProfiles(rawProfiles: UserProfile[]): UserProfile[] {
  if (!Array.isArray(rawProfiles) || rawProfiles.length === 0) {
    return DEFAULT_PROFILES;
  }

  const deletedIds = getDeletedProfileIds();
  const result: UserProfile[] = [];
  let momAdminProfile: UserProfile | null = null;
  const seenIds = new Set<string>();

  for (const p of rawProfiles) {
    if (!p || !p.name) continue;

    // Check if this profile was previously deleted
    if (deletedIds.has(p.id)) continue;

    // Check if this is the Mom Admin profile
    if (p.id === 'user-mom' || p.name === '열공마미' || p.isMomOrAdmin === true) {
      if (!momAdminProfile) {
        momAdminProfile = {
          id: 'user-mom',
          name: '열공마미',
          grade: '',
          targetLevel: '전체 관리 및 학습 지도',
          avatarTheme: p.avatarTheme || 'spider-red',
          createdAt: p.createdAt || new Date().toISOString(),
          isMomOrAdmin: true,
          momEncouragement: null,
        };
      }
      continue; // Skip any duplicate mom admin profiles
    }

    // Skip old 'user-default' or seed students
    if (p.id === 'user-default' || p.id === 'user-student-1' || !p.name.trim()) continue;

    // Add unique learner profile
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push({
        ...p,
        name: p.name.trim(),
        isMomOrAdmin: false,
      });
    }
  }

  // Ensure canonical '열공마미' is always first
  if (!momAdminProfile) {
    momAdminProfile = { ...DEFAULT_PROFILES[0] };
  }

  return [momAdminProfile, ...result];
}

// ================= USER PROFILES =================

export function getUserProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    const sanitized = cleanAndDeduplicateProfiles(parsed);

    // Save cleaned list if there was any difference/duplicate
    if (JSON.stringify(parsed) !== JSON.stringify(sanitized)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(sanitized));
    }

    // If active profile ID was pointing to deleted 'user-default' or non-existent, fix to 'user-mom'
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (activeId === 'user-default' || !sanitized.some((p) => p.id === activeId)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, sanitized[0].id);
    }

    return sanitized;
  } catch (e) {
    console.error('Failed to get profiles', e);
    return DEFAULT_PROFILES;
  }
}

export function getActiveProfileId(): string {
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    const profiles = getUserProfiles();
    if (activeId && profiles.some((p) => p.id === activeId)) {
      return activeId;
    }
    const fallback = profiles[0]?.id || 'user-mom';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, fallback);
    return fallback;
  } catch {
    return 'user-mom';
  }
}

export function getActiveProfile(): UserProfile {
  const activeId = getActiveProfileId();
  const profiles = getUserProfiles();
  return profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];
}

export function setActiveProfileId(profileId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
}

export function createUserProfile(
  name: string, 
  grade: GradeType, 
  targetLevel: string = '1등급 목표', 
  avatarTheme: SpiderSuitTheme = 'spider-red'
): UserProfile {
  const profiles = getUserProfiles();
  const newProfile: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || `학습자 ${profiles.length + 1}`,
    grade,
    targetLevel,
    avatarTheme,
    createdAt: new Date().toISOString(),
    isMomOrAdmin: false,
  };

  profiles.push(newProfile);
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  setActiveProfileId(newProfile.id);

  // Sync with server immediately
  syncProfileToServer(newProfile);

  return newProfile;
}

export function updateUserProfile(profile: UserProfile): void {
  const profiles = getUserProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    syncProfileToServer(profile);
  }
}

export function updateLearnerSuit(profileId: string, suitTheme: SpiderSuitTheme): UserProfile | null {
  const profiles = getUserProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index >= 0) {
    profiles[index].avatarTheme = suitTheme;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    syncProfileToServer(profiles[index]);
    return profiles[index];
  }
  return null;
}

export function sendMomEncouragement(
  learnerId: string,
  message: string,
  stamp: MomEncouragement['stamp'] = 'heart',
  momName: string = '열공마미'
): UserProfile | null {
  const profiles = getUserProfiles();
  const index = profiles.findIndex((p) => p.id === learnerId);
  if (index >= 0) {
    const enc: MomEncouragement = {
      id: `enc-${Date.now()}`,
      message: message.trim(),
      stamp,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      momName,
    };
    profiles[index].momEncouragement = enc;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    
    // Sync to server
    fetch('/api/mom-encouragements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, message, stamp, momName }),
    }).catch((err) => console.warn('Failed to sync encouragement to server:', err));

    return profiles[index];
  }
  return null;
}

/**
 * Delete a user profile with ADMIN PERMISSION ENFORCEMENT.
 * Non-admin learners cannot delete profiles.
 */
export function deleteUserProfile(profileId: string, isMomAdmin: boolean = false): boolean {
  // Permission guard: Only admin can delete learners
  if (!isMomAdmin) {
    console.warn('Deletion denied: Only admin (열공마미) has permission to delete learner profiles.');
    return false;
  }

  let profiles = getUserProfiles();
  const target = profiles.find((p) => p.id === profileId);
  if (!target || target.isMomOrAdmin || target.name === '열공마미' || target.id === 'user-mom') {
    console.warn('Cannot delete admin profile');
    return false;
  }

  // 1. Mark as permanently deleted so it will never be resurrected by sync
  markProfileAsDeleted(profileId);

  // 2. Remove locally
  const remaining = profiles.filter((p) => p.id !== profileId);
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(cleanAndDeduplicateProfiles(remaining)));

  // 3. Clean local study records & words associated with this profile
  clearStudyRecords(profileId);
  clearSavedWords(profileId);

  if (getActiveProfileId() === profileId) {
    setActiveProfileId(remaining[0]?.id || 'user-mom');
  }

  // 4. Sync deletion to server with admin credentials
  fetch(`/api/profiles/${encodeURIComponent(profileId)}?isAdmin=true`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': 'mom-admin',
      'x-is-admin': 'true',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && Array.isArray(data.profiles)) {
        const deletedSet = getDeletedProfileIds();
        const filtered = data.profiles.filter((p: UserProfile) => !deletedSet.has(p.id));
        const sanitized = cleanAndDeduplicateProfiles(filtered);
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(sanitized));
        window.dispatchEvent(new CustomEvent('app_storage_synced'));
      }
    })
    .catch((err) => console.warn('Failed to delete on server:', err));

  window.dispatchEvent(new CustomEvent('app_storage_synced'));
  return true;
}

// Background sync helpers
function syncProfileToServer(profile: UserProfile) {
  fetch('/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.profiles) {
        // Merge without losing current local active session
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(data.profiles));
        window.dispatchEvent(new CustomEvent('app_storage_synced'));
      }
    })
    .catch((err) => console.warn('Failed to sync profile to server:', err));
}

// ================= PASSAGES =================

export function getStoredPassages(): Passage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSAGES);
    const custom: Passage[] = raw ? JSON.parse(raw) : [];
    return [...PRESET_PASSAGES, ...custom];
  } catch (e) {
    console.error('Failed to load passages from storage', e);
    return PRESET_PASSAGES;
  }
}

export function saveCustomPassage(passage: Passage): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSAGES);
    const custom: Passage[] = raw ? JSON.parse(raw) : [];
    custom.unshift(passage);
    localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(custom));

    // Sync to server
    fetch('/api/custom-passages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passage),
    }).catch((err) => console.warn('Failed to sync custom passage to server:', err));
  } catch (e) {
    console.error('Failed to save custom passage', e);
  }
}

// ================= SAVED WORDS (PER USER) =================

export function getAllRawSavedWords(): SavedWord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_WORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getSavedWords(userId?: string): SavedWord[] {
  const currentUid = userId || getActiveProfileId();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_WORDS);
    if (!raw) {
      // Seed initial words for the current user
      const initial: SavedWord[] = PRESET_PASSAGES[0].vocabulary.map((v, i) => ({
        id: `seed-word-${currentUid}-${i}`,
        userId: currentUid,
        word: v.word,
        phonetic: v.phonetic,
        meaningKo: v.meaningKo,
        partOfSpeech: v.partOfSpeech,
        exampleEn: v.exampleEn,
        exampleKo: v.exampleKo,
        status: 'learning',
        savedAt: new Date().toISOString(),
        passageId: PRESET_PASSAGES[0].id,
        passageTitle: PRESET_PASSAGES[0].title,
        reviewCount: 0,
      }));
      localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(initial));
      return initial;
    }
    const allWords: SavedWord[] = JSON.parse(raw);
    // Filter words matching current user or words without userId (for legacy compatibility)
    return allWords.filter((w) => !w.userId || w.userId === currentUid);
  } catch (e) {
    console.error('Failed to get saved words', e);
    return [];
  }
}

export function saveWord(wordItem: Partial<SavedWord> & { word: string; meaningKo: string }, userId?: string): SavedWord {
  const currentUid = userId || getActiveProfileId();
  const allWords = getAllRawSavedWords();
  const existing = allWords.find(
    (w) => (!w.userId || w.userId === currentUid) && w.word.toLowerCase() === wordItem.word.toLowerCase()
  );
  
  if (existing) {
    return existing;
  }

  const newWord: SavedWord = {
    id: `word-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: currentUid,
    word: wordItem.word,
    phonetic: wordItem.phonetic || '',
    meaningKo: wordItem.meaningKo,
    partOfSpeech: wordItem.partOfSpeech || 'n.',
    exampleEn: wordItem.exampleEn || '',
    exampleKo: wordItem.exampleKo || '',
    status: 'learning',
    savedAt: new Date().toISOString(),
    passageId: wordItem.passageId || 'custom',
    passageTitle: wordItem.passageTitle || 'Custom',
    reviewCount: 0,
  };

  allWords.unshift(newWord);
  localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(allWords));

  // Sync to server
  fetch('/api/saved-words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newWord),
  }).catch((err) => console.warn('Failed to sync word to server:', err));

  return newWord;
}

export function toggleWordStatus(wordId: string): SavedWord[] {
  const currentUid = getActiveProfileId();
  const allWords = getAllRawSavedWords();
  let updatedWord: SavedWord | null = null;
  const updated = allWords.map((w) => {
    if (w.id === wordId) {
      updatedWord = {
        ...w,
        status: (w.status === 'learning' ? 'memorized' : 'learning') as 'learning' | 'memorized',
        reviewCount: (w.reviewCount || 0) + 1,
      };
      return updatedWord;
    }
    return w;
  });
  localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(updated));

  if (updatedWord) {
    fetch('/api/saved-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWord),
    }).catch((err) => console.warn('Failed to sync toggle word to server:', err));
  }

  return updated.filter((w) => !w.userId || w.userId === currentUid);
}

export function removeSavedWord(wordId: string): SavedWord[] {
  const currentUid = getActiveProfileId();
  const allWords = getAllRawSavedWords();
  const filtered = allWords.filter((w) => w.id !== wordId);
  localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(filtered));
  return filtered.filter((w) => !w.userId || w.userId === currentUid);
}

// ================= STUDY RECORDS & ANALYTICS (PER USER) =================

export function getAllRawStudyRecords(): StudyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_RECORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getStudyRecords(userId?: string): StudyRecord[] {
  const currentUid = userId || getActiveProfileId();
  try {
    const allRecords = getAllRawStudyRecords();
    return allRecords.filter((r) => !r.userId || r.userId === currentUid);
  } catch (e) {
    console.error('Failed to get study records', e);
    return [];
  }
}

export function clearStudyRecords(userId?: string): void {
  const currentUid = userId || getActiveProfileId();
  try {
    const allRecords = getAllRawStudyRecords();
    const remaining = allRecords.filter((r) => r.userId && r.userId !== currentUid);
    localStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify(remaining));
  } catch (e) {
    console.error('Failed to clear study records', e);
  }
}

export function clearAllStudyRecords(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear all study records', e);
  }
}

export function clearSavedWords(userId?: string): void {
  const currentUid = userId || getActiveProfileId();
  try {
    const allWords = getAllRawSavedWords();
    const remaining = allWords.filter((w) => w.userId && w.userId !== currentUid);
    localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(remaining));
  } catch (e) {
    console.error('Failed to clear saved words', e);
  }
}

export function clearAllSavedWords(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear all saved words', e);
  }
}

export interface ResetDataOptions {
  resetRecords?: boolean;
  resetWords?: boolean;
  resetEncouragement?: boolean;
}

export function resetLearnerData(userId: string, options: ResetDataOptions = { resetRecords: true, resetWords: true }): void {
  try {
    if (options.resetRecords !== false) {
      clearStudyRecords(userId);
    }
    if (options.resetWords) {
      clearSavedWords(userId);
    }
    if (options.resetEncouragement) {
      const profiles = getUserProfiles();
      const updated = profiles.map((p) => {
        if (p.id === userId) {
          const { momEncouragement, ...rest } = p;
          return rest;
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updated));
    }

    // Sync reset to server
    fetch('/api/study-records/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'mom-admin',
        'x-is-admin': 'true',
      },
      body: JSON.stringify({ targetLearnerId: userId, ...options }),
    }).catch((err) => console.warn('Failed to sync reset to server:', err));
  } catch (e) {
    console.error('Failed to reset learner data', e);
  }
}

export function resetAllLearnersData(options: ResetDataOptions = { resetRecords: true, resetWords: true }): void {
  try {
    if (options.resetRecords !== false) {
      clearAllStudyRecords();
    }
    if (options.resetWords) {
      clearAllSavedWords();
    }
    if (options.resetEncouragement) {
      const profiles = getUserProfiles();
      const updated = profiles.map((p) => {
        const { momEncouragement, ...rest } = p;
        return rest;
      });
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updated));
    }

    // Sync reset to server
    fetch('/api/study-records/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'mom-admin',
        'x-is-admin': 'true',
      },
      body: JSON.stringify({ targetLearnerId: 'all', ...options }),
    }).catch((err) => console.warn('Failed to sync reset all to server:', err));
  } catch (e) {
    console.error('Failed to reset all learners data', e);
  }
}

export function saveStudyRecord(record: Omit<StudyRecord, 'id' | 'completedAt'>, userId?: string): StudyRecord {
  const currentUid = userId || getActiveProfileId();
  const allRecords = getAllRawStudyRecords();
  
  const newRecord: StudyRecord = {
    ...record,
    userId: currentUid,
    id: `rec-${Date.now()}`,
    completedAt: new Date().toISOString(),
  };

  // Replace if already studied today on same passage for this user, or append
  const existingIdx = allRecords.findIndex(
    (r) => (!r.userId || r.userId === currentUid) && r.date === record.date && r.passageId === record.passageId
  );
  if (existingIdx >= 0) {
    allRecords[existingIdx] = newRecord;
  } else {
    allRecords.push(newRecord);
  }

  localStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify(allRecords));

  // Sync to server
  fetch('/api/study-records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord),
  }).catch((err) => console.warn('Failed to sync study record to server:', err));

  return newRecord;
}

// ================= SETTINGS & STREAK =================

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function calculateStreak(userId?: string): number {
  const records = getStudyRecords(userId);
  if (records.length === 0) return 0;

  const dates = Array.from(new Set(records.map((r) => r.date))).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = 0;
  let checkDate = dates.includes(today) ? new Date() : dates.includes(yesterday) ? new Date(Date.now() - 86400000) : null;

  if (!checkDate) return 0;

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (dates.includes(dStr)) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return streak;
}

// ================= SERVER SYNCHRONIZATION ENGINE =================

let isSyncing = false;

/**
 * Fetch all server data and merge with local storage.
 * Ensures learners registered on any device are immediately synced to Admin and other devices.
 */
export async function syncWithServer(): Promise<boolean> {
  if (isSyncing) return false;
  isSyncing = true;

  try {
    const response = await fetch('/api/sync-all');
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) return false;

    const deletedIds = getDeletedProfileIds();

    // 1. Sync Profiles (Server is the source of truth, filtered by deletion blacklist)
    if (Array.isArray(data.profiles) && data.profiles.length > 0) {
      const serverValidProfiles = data.profiles.filter(
        (p: UserProfile) => p && p.id && !deletedIds.has(p.id)
      );
      const sanitizedProfiles = cleanAndDeduplicateProfiles(serverValidProfiles);
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(sanitizedProfiles));
      
      const currentActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      if (deletedIds.has(currentActiveId || '') || !sanitizedProfiles.some((p) => p.id === currentActiveId)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, sanitizedProfiles[0]?.id || 'user-mom');
      }
    }

    // 2. Sync Study Records
    if (Array.isArray(data.studyRecords)) {
      const localRecords = getAllRawStudyRecords();
      const recordMap = new Map<string, StudyRecord>();
      data.studyRecords.forEach((r: StudyRecord) => {
        if (r && r.id) recordMap.set(r.id, r);
      });
      localRecords.forEach((r: StudyRecord) => {
        if (r && r.id && !recordMap.has(r.id)) {
          recordMap.set(r.id, r);
        }
      });
      localStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify(Array.from(recordMap.values())));
    }

    // 3. Sync Saved Words
    if (Array.isArray(data.savedWords) && data.savedWords.length > 0) {
      const localWords = getAllRawSavedWords();
      const wordMap = new Map<string, SavedWord>();
      data.savedWords.forEach((w: SavedWord) => {
        if (w && w.id) wordMap.set(w.id, w);
      });
      localWords.forEach((w: SavedWord) => {
        if (w && w.id && !wordMap.has(w.id)) {
          wordMap.set(w.id, w);
        }
      });
      localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(Array.from(wordMap.values())));
    }

    // 4. Sync Custom Passages
    if (Array.isArray(data.customPassages) && data.customPassages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PASSAGES, JSON.stringify(data.customPassages));
    }

    window.dispatchEvent(new CustomEvent('app_storage_synced'));
    return true;
  } catch (err) {
    // Graceful offline fallback
    console.debug('Server sync status:', err);
    return false;
  } finally {
    isSyncing = false;
  }
}

// Auto-sync scheduler
let autoSyncInterval: any = null;

export function initDefaultData(): void {
  getUserProfiles();
  getSavedWords();
  getStudyRecords();
  getStoredPassages();

  // Initial sync immediately
  syncWithServer();

  // Periodic polling every 5 seconds for real-time multi-device sync
  if (!autoSyncInterval && typeof window !== 'undefined') {
    autoSyncInterval = setInterval(() => {
      syncWithServer();
    }, 5000);

    // Sync on tab focus or visibility return
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    });
  }
}
