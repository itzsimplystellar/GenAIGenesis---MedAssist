// Body region types for the anatomy diagram (main regions)
export type BodyRegion =
  | 'head'
  | 'neck'
  | 'chest'
  | 'upper-back'
  | 'abdomen'
  | 'lower-back'
  | 'left-shoulder'
  | 'right-shoulder'
  | 'left-upper-arm'
  | 'right-upper-arm'
  | 'left-forearm'
  | 'right-forearm'
  | 'left-hand'
  | 'right-hand'
  | 'pelvis'
  | 'left-thigh'
  | 'right-thigh'
  | 'left-knee'
  | 'right-knee'
  | 'left-shin'
  | 'right-shin'
  | 'left-foot'
  | 'right-foot'
  // Sub-regions for head
  | 'head-forehead'
  | 'head-left-temple'
  | 'head-right-temple'
  | 'head-left-eye'
  | 'head-right-eye'
  | 'head-nose'
  | 'head-left-cheek'
  | 'head-right-cheek'
  | 'head-left-ear'
  | 'head-right-ear'
  | 'head-mouth'
  | 'head-chin'
  | 'head-left-jaw'
  | 'head-right-jaw'
  | 'head-top'
  | 'head-back'
  // Sub-regions for chest
  | 'chest-left-upper'
  | 'chest-right-upper'
  | 'chest-left-lower'
  | 'chest-right-lower'
  | 'chest-sternum'
  | 'chest-left-rib'
  | 'chest-right-rib'
  // Sub-regions for abdomen
  | 'abdomen-upper-left'
  | 'abdomen-upper-center'
  | 'abdomen-upper-right'
  | 'abdomen-middle-left'
  | 'abdomen-navel'
  | 'abdomen-middle-right'
  | 'abdomen-lower-left'
  | 'abdomen-lower-center'
  | 'abdomen-lower-right'
  // Sub-regions for hands
  | 'left-hand-palm'
  | 'left-hand-back'
  | 'left-hand-thumb'
  | 'left-hand-index'
  | 'left-hand-middle'
  | 'left-hand-ring'
  | 'left-hand-pinky'
  | 'left-hand-wrist'
  | 'right-hand-palm'
  | 'right-hand-back'
  | 'right-hand-thumb'
  | 'right-hand-index'
  | 'right-hand-middle'
  | 'right-hand-ring'
  | 'right-hand-pinky'
  | 'right-hand-wrist'
  // Sub-regions for feet
  | 'left-foot-top'
  | 'left-foot-sole'
  | 'left-foot-heel'
  | 'left-foot-arch'
  | 'left-foot-toes'
  | 'left-foot-ankle'
  | 'right-foot-top'
  | 'right-foot-sole'
  | 'right-foot-heel'
  | 'right-foot-arch'
  | 'right-foot-toes'
  | 'right-foot-ankle'
  // Sub-regions for back
  | 'upper-back-left'
  | 'upper-back-center'
  | 'upper-back-right'
  | 'lower-back-left'
  | 'lower-back-center'
  | 'lower-back-right'
  // Sub-regions for neck
  | 'neck-front'
  | 'neck-back'
  | 'neck-left'
  | 'neck-right'

// Main regions that can be zoomed into
export type ZoomableRegion = 'head' | 'chest' | 'abdomen' | 'left-hand' | 'right-hand' | 'left-foot' | 'right-foot' | 'upper-back' | 'lower-back' | 'neck'

export const ZOOMABLE_REGIONS: ZoomableRegion[] = ['head', 'neck', 'chest', 'abdomen', 'upper-back', 'lower-back', 'left-hand', 'right-hand', 'left-foot', 'right-foot']

export const BODY_REGION_LABELS: Record<BodyRegion, string> = {
  'head': 'Head',
  'neck': 'Neck',
  'chest': 'Chest',
  'upper-back': 'Upper Back',
  'abdomen': 'Abdomen',
  'lower-back': 'Lower Back',
  'left-shoulder': 'Left Shoulder',
  'right-shoulder': 'Right Shoulder',
  'left-upper-arm': 'Left Upper Arm',
  'right-upper-arm': 'Right Upper Arm',
  'left-forearm': 'Left Forearm',
  'right-forearm': 'Right Forearm',
  'left-hand': 'Left Hand',
  'right-hand': 'Right Hand',
  'pelvis': 'Pelvis/Hips',
  'left-thigh': 'Left Thigh',
  'right-thigh': 'Right Thigh',
  'left-knee': 'Left Knee',
  'right-knee': 'Right Knee',
  'left-shin': 'Left Shin/Calf',
  'right-shin': 'Right Shin/Calf',
  'left-foot': 'Left Foot',
  'right-foot': 'Right Foot',
  // Head sub-regions
  'head-forehead': 'Forehead',
  'head-left-temple': 'Left Temple',
  'head-right-temple': 'Right Temple',
  'head-left-eye': 'Left Eye Area',
  'head-right-eye': 'Right Eye Area',
  'head-nose': 'Nose',
  'head-left-cheek': 'Left Cheek',
  'head-right-cheek': 'Right Cheek',
  'head-left-ear': 'Left Ear',
  'head-right-ear': 'Right Ear',
  'head-mouth': 'Mouth/Lips',
  'head-chin': 'Chin',
  'head-left-jaw': 'Left Jaw',
  'head-right-jaw': 'Right Jaw',
  'head-top': 'Top of Head',
  'head-back': 'Back of Head',
  // Chest sub-regions
  'chest-left-upper': 'Left Upper Chest',
  'chest-right-upper': 'Right Upper Chest',
  'chest-left-lower': 'Left Lower Chest',
  'chest-right-lower': 'Right Lower Chest',
  'chest-sternum': 'Sternum/Breastbone',
  'chest-left-rib': 'Left Ribs',
  'chest-right-rib': 'Right Ribs',
  // Abdomen sub-regions
  'abdomen-upper-left': 'Upper Left Abdomen',
  'abdomen-upper-center': 'Upper Center Abdomen',
  'abdomen-upper-right': 'Upper Right Abdomen',
  'abdomen-middle-left': 'Middle Left Abdomen',
  'abdomen-navel': 'Navel Area',
  'abdomen-middle-right': 'Middle Right Abdomen',
  'abdomen-lower-left': 'Lower Left Abdomen',
  'abdomen-lower-center': 'Lower Center Abdomen',
  'abdomen-lower-right': 'Lower Right Abdomen',
  // Hand sub-regions
  'left-hand-palm': 'Left Palm',
  'left-hand-back': 'Left Hand Back',
  'left-hand-thumb': 'Left Thumb',
  'left-hand-index': 'Left Index Finger',
  'left-hand-middle': 'Left Middle Finger',
  'left-hand-ring': 'Left Ring Finger',
  'left-hand-pinky': 'Left Pinky Finger',
  'left-hand-wrist': 'Left Wrist',
  'right-hand-palm': 'Right Palm',
  'right-hand-back': 'Right Hand Back',
  'right-hand-thumb': 'Right Thumb',
  'right-hand-index': 'Right Index Finger',
  'right-hand-middle': 'Right Middle Finger',
  'right-hand-ring': 'Right Ring Finger',
  'right-hand-pinky': 'Right Pinky Finger',
  'right-hand-wrist': 'Right Wrist',
  // Foot sub-regions
  'left-foot-top': 'Left Foot Top',
  'left-foot-sole': 'Left Sole',
  'left-foot-heel': 'Left Heel',
  'left-foot-arch': 'Left Arch',
  'left-foot-toes': 'Left Toes',
  'left-foot-ankle': 'Left Ankle',
  'right-foot-top': 'Right Foot Top',
  'right-foot-sole': 'Right Sole',
  'right-foot-heel': 'Right Heel',
  'right-foot-arch': 'Right Arch',
  'right-foot-toes': 'Right Toes',
  'right-foot-ankle': 'Right Ankle',
  // Back sub-regions
  'upper-back-left': 'Upper Left Back',
  'upper-back-center': 'Upper Center Back',
  'upper-back-right': 'Upper Right Back',
  'lower-back-left': 'Lower Left Back',
  'lower-back-center': 'Lower Center Back (Spine)',
  'lower-back-right': 'Lower Right Back',
  // Neck sub-regions
  'neck-front': 'Front of Neck/Throat',
  'neck-back': 'Back of Neck',
  'neck-left': 'Left Side of Neck',
  'neck-right': 'Right Side of Neck',
}

// Duration options for symptoms
export type SymptomDuration = 
  | 'just-started'
  | 'few-hours'
  | 'today'
  | 'few-days'
  | 'week'
  | 'few-weeks'
  | 'month'
  | 'months'
  | 'chronic'

export const SYMPTOM_DURATION_LABELS: Record<SymptomDuration, string> = {
  'just-started': 'Just started',
  'few-hours': 'A few hours',
  'today': 'Since today',
  'few-days': 'A few days',
  'week': 'About a week',
  'few-weeks': 'A few weeks',
  'month': 'About a month',
  'months': 'Several months',
  'chronic': 'Chronic/ongoing',
}

// Symptom change status
export type SymptomChange = 
  | 'new'
  | 'same'
  | 'improving'
  | 'worsening'
  | 'fluctuating'

export const SYMPTOM_CHANGE_LABELS: Record<SymptomChange, string> = {
  'new': 'New symptom',
  'same': 'About the same',
  'improving': 'Getting better',
  'worsening': 'Getting worse',
  'fluctuating': 'Comes and goes',
}

// Symptom with severity
export interface Symptom {
  id: string
  name: string
  severity: 1 | 2 | 3 | 4 | 5 // 1 = mild, 5 = severe
  bodyRegions: BodyRegion[]
  notes?: string
  // New fields for tracking persistence and changes
  duration: SymptomDuration
  startDate?: string // ISO date string for when it started
  changeStatus: SymptomChange
}

// Mood levels
export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Bad',
  4: 'Below Average',
  5: 'Average',
  6: 'Above Average',
  7: 'Good',
  8: 'Very Good',
  9: 'Great',
  10: 'Excellent',
}

// Journal entry
export interface JournalEntry {
  id: string
  createdAt: string // ISO date string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  mood: MoodLevel
  overallFeeling: string
  symptoms: Symptom[]
  bodyRegions: BodyRegion[] // Quick selection without symptoms
  notes: string
  archived: boolean
}

// Report generated by AI
export interface MedicalReport {
  id: string
  createdAt: string
  dateRange: {
    start: string
    end: string
  }
  summary: string
  symptomPatterns: string[]
  symptomTimeline?: string // Analysis of duration, onset, and changes
  moodTrends: string
  suggestedSpecialists: Specialist[]
  recommendations: string[]
  disclaimer: string
}

// Specialist suggestion
export interface Specialist {
  id: string
  name: string
  specialty: string
  address: string
  phone: string
  distance?: string
  availableHours?: string
}

// App state
export interface AppState {
  entries: JournalEntry[]
  reports: MedicalReport[]
}

// Time of day helper
export function getTimeOfDay(): JournalEntry['timeOfDay'] {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export const TIME_OF_DAY_LABELS: Record<JournalEntry['timeOfDay'], string> = {
  morning: 'Morning (5am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 9pm)',
  night: 'Night (9pm - 5am)',
}

// Common symptoms list for quick selection
export const COMMON_SYMPTOMS = [
  'Headache',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Pain',
  'Stiffness',
  'Swelling',
  'Numbness',
  'Tingling',
  'Weakness',
  'Fever',
  'Chills',
  'Cough',
  'Shortness of breath',
  'Chest pain',
  'Heart palpitations',
  'Stomach ache',
  'Bloating',
  'Constipation',
  'Diarrhea',
  'Loss of appetite',
  'Difficulty sleeping',
  'Anxiety',
  'Brain fog',
  'Joint pain',
  'Muscle ache',
  'Skin rash',
  'Itching',
  'Vision changes',
  'Hearing changes',
]
