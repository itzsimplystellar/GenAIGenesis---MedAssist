// Mock specialist data for demo purposes
// In production, this would be replaced with a real API call (e.g., Google Places API)

import type { Specialist } from '@/lib/types'

export const MOCK_SPECIALISTS: Record<string, Specialist[]> = {
  // General/Primary Care
  'general': [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      specialty: 'Primary Care Physician',
      address: '123 Medical Center Dr, Suite 100',
      phone: '(555) 234-5678',
      distance: '0.8 miles',
      availableHours: 'Mon-Fri 8am-5pm',
    },
    {
      id: '2',
      name: 'Dr. Michael Roberts',
      specialty: 'Family Medicine',
      address: '456 Healthcare Blvd, Suite 200',
      phone: '(555) 345-6789',
      distance: '1.2 miles',
      availableHours: 'Mon-Sat 9am-6pm',
    },
  ],
  // Neurologist
  'neurologist': [
    {
      id: '3',
      name: 'Dr. Emily Watson',
      specialty: 'Neurology',
      address: '789 Brain Health Center, Suite 300',
      phone: '(555) 456-7890',
      distance: '2.1 miles',
      availableHours: 'Mon-Thu 9am-4pm',
    },
  ],
  // Cardiologist
  'cardiologist': [
    {
      id: '4',
      name: 'Dr. James Park',
      specialty: 'Cardiology',
      address: '321 Heart Care Ave, Suite 150',
      phone: '(555) 567-8901',
      distance: '1.5 miles',
      availableHours: 'Mon-Fri 8am-4pm',
    },
  ],
  // Gastroenterologist
  'gastroenterologist': [
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Gastroenterology',
      address: '654 Digestive Health Pkwy, Suite 250',
      phone: '(555) 678-9012',
      distance: '3.2 miles',
      availableHours: 'Tue-Sat 9am-5pm',
    },
  ],
  // Orthopedist
  'orthopedist': [
    {
      id: '6',
      name: 'Dr. David Kim',
      specialty: 'Orthopedic Surgery',
      address: '987 Bone & Joint Clinic, Suite 400',
      phone: '(555) 789-0123',
      distance: '2.8 miles',
      availableHours: 'Mon-Fri 7am-3pm',
    },
  ],
  // Dermatologist
  'dermatologist': [
    {
      id: '7',
      name: 'Dr. Amanda Foster',
      specialty: 'Dermatology',
      address: '147 Skin Care Center, Suite 50',
      phone: '(555) 890-1234',
      distance: '1.9 miles',
      availableHours: 'Mon-Wed 10am-6pm',
    },
  ],
  // Psychiatrist
  'psychiatrist': [
    {
      id: '8',
      name: 'Dr. Robert Martinez',
      specialty: 'Psychiatry',
      address: '258 Mental Wellness Blvd, Suite 175',
      phone: '(555) 901-2345',
      distance: '2.4 miles',
      availableHours: 'Mon-Fri 9am-5pm',
    },
  ],
  // Pulmonologist
  'pulmonologist': [
    {
      id: '9',
      name: 'Dr. Jennifer Lee',
      specialty: 'Pulmonology',
      address: '369 Respiratory Care Dr, Suite 220',
      phone: '(555) 012-3456',
      distance: '4.1 miles',
      availableHours: 'Tue-Fri 8am-4pm',
    },
  ],
  // Rheumatologist
  'rheumatologist': [
    {
      id: '10',
      name: 'Dr. Kevin O\'Brien',
      specialty: 'Rheumatology',
      address: '741 Joint Care Center, Suite 125',
      phone: '(555) 123-4567',
      distance: '3.5 miles',
      availableHours: 'Mon-Thu 9am-5pm',
    },
  ],
  // ENT
  'ent': [
    {
      id: '11',
      name: 'Dr. Patricia Nguyen',
      specialty: 'Otolaryngology (ENT)',
      address: '852 ENT Specialists Center, Suite 80',
      phone: '(555) 234-5679',
      distance: '2.7 miles',
      availableHours: 'Mon-Fri 8:30am-4:30pm',
    },
  ],
  // Ophthalmologist
  'ophthalmologist': [
    {
      id: '12',
      name: 'Dr. Thomas Brown',
      specialty: 'Ophthalmology',
      address: '963 Eye Care Institute, Suite 60',
      phone: '(555) 345-6780',
      distance: '1.8 miles',
      availableHours: 'Mon-Sat 9am-6pm',
    },
  ],
}

// Function to get specialists based on symptoms and body regions
export function getRelevantSpecialists(
  symptoms: string[],
  bodyRegions: string[]
): Specialist[] {
  const specialistTypes = new Set<string>()

  // Always suggest primary care
  specialistTypes.add('general')

  // Map symptoms to specialists
  const symptomMapping: Record<string, string[]> = {
    'headache': ['neurologist'],
    'migraine': ['neurologist'],
    'dizziness': ['neurologist', 'ent'],
    'vision changes': ['ophthalmologist', 'neurologist'],
    'hearing changes': ['ent'],
    'chest pain': ['cardiologist', 'pulmonologist'],
    'heart palpitations': ['cardiologist'],
    'shortness of breath': ['pulmonologist', 'cardiologist'],
    'cough': ['pulmonologist'],
    'stomach ache': ['gastroenterologist'],
    'bloating': ['gastroenterologist'],
    'constipation': ['gastroenterologist'],
    'diarrhea': ['gastroenterologist'],
    'nausea': ['gastroenterologist'],
    'joint pain': ['rheumatologist', 'orthopedist'],
    'muscle ache': ['orthopedist', 'rheumatologist'],
    'stiffness': ['rheumatologist', 'orthopedist'],
    'swelling': ['rheumatologist'],
    'skin rash': ['dermatologist'],
    'itching': ['dermatologist'],
    'anxiety': ['psychiatrist'],
    'difficulty sleeping': ['psychiatrist'],
    'brain fog': ['neurologist', 'psychiatrist'],
    'fatigue': ['general'],
    'fever': ['general'],
    'weakness': ['neurologist'],
    'numbness': ['neurologist'],
    'tingling': ['neurologist'],
  }

  // Map body regions to specialists
  const regionMapping: Record<string, string[]> = {
    'head': ['neurologist'],
    'neck': ['orthopedist', 'ent'],
    'chest': ['cardiologist', 'pulmonologist'],
    'upper-back': ['orthopedist'],
    'lower-back': ['orthopedist'],
    'abdomen': ['gastroenterologist'],
    'left-shoulder': ['orthopedist'],
    'right-shoulder': ['orthopedist'],
    'left-knee': ['orthopedist'],
    'right-knee': ['orthopedist'],
    'left-hand': ['orthopedist', 'rheumatologist'],
    'right-hand': ['orthopedist', 'rheumatologist'],
  }

  // Add specialists based on symptoms
  symptoms.forEach((symptom) => {
    const lowerSymptom = symptom.toLowerCase()
    Object.entries(symptomMapping).forEach(([key, types]) => {
      if (lowerSymptom.includes(key)) {
        types.forEach((type) => specialistTypes.add(type))
      }
    })
  })

  // Add specialists based on body regions
  bodyRegions.forEach((region) => {
    const types = regionMapping[region]
    if (types) {
      types.forEach((type) => specialistTypes.add(type))
    }
  })

  // Collect all relevant specialists
  const specialists: Specialist[] = []
  specialistTypes.forEach((type) => {
    const typeSpecialists = MOCK_SPECIALISTS[type]
    if (typeSpecialists) {
      specialists.push(...typeSpecialists)
    }
  })

  // Remove duplicates and limit to 5
  const uniqueSpecialists = specialists.filter(
    (s, index, self) => index === self.findIndex((t) => t.id === s.id)
  )

  return uniqueSpecialists.slice(0, 5)
}
