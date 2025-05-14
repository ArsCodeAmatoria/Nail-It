import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hvsvmxrktlmtywxwbwdd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2c3ZteHJrdGxtdHl3eHdid2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODc1ODIsImV4cCI6MjA2MjY2MzU4Mn0.9nwvTupvFoTJVWWtoXtNnQ-vj73vy1dx91uLjzChJ98';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the question categories
const categoryKeywords = {
  'Foundations': ['footing', 'foundation', 'slab', 'concrete', 'soil'],
  'Framing': ['framing', 'stud', 'joist', 'lumber', 'nail', 'fastener', 'truss', 'sheathing', 'I-joist'],
  'Insulation': ['insulation', 'R-value', 'RSI', 'vapor barrier'],
  'Finishing': ['guard rail', 'stair', 'staircase', 'riser', 'smoke detector'],
  'Materials': ['wood', 'species', 'Douglas Fir', 'Pine', 'Spruce', 'Cedar', 'plywood'],
  'Building Code': ['BCBC', 'code', 'minimum', 'maximum', 'requirement']
};

// All questions with categories
const questionsWithCategories = [
  {
    question: "What is the minimum required depth for a footing in a heated building in BC?",
    options: ["300 mm", "450 mm", "600 mm", "900 mm"],
    correct_answer: 2,
    explanation: "The minimum depth for a footing in a heated building is 600 mm to prevent frost heave.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.12.2.2",
    category: "Foundations"
  },
  {
    question: "Which fastener is best for joining two pieces of dimensional lumber in framing?",
    options: ["Drywall screw", "Common nail", "Finishing nail", "Brad nail"],
    correct_answer: 1,
    explanation: "Common nails are used for structural framing connections.",
    reference: "Carpentry Textbook, Chapter 7",
    bcbc_reference: "BCBC 2024 9.23.3.3",
    category: "Framing"
  },
  {
    question: "What is the standard spacing for roof trusses in residential construction?",
    options: ["12 inches", "16 inches", "24 inches", "36 inches"],
    correct_answer: 2,
    explanation: "The standard spacing for roof trusses in residential construction is 24 inches (610 mm) on center.",
    reference: "Carpentry Textbook, Chapter 10",
    bcbc_reference: "BCBC 2024 9.23.14.2",
    category: "Framing"
  },
  {
    question: "What is the minimum thickness for a concrete slab on grade in a heated building?",
    options: ["75 mm", "100 mm", "125 mm", "150 mm"],
    correct_answer: 0,
    explanation: "The minimum thickness for a concrete slab on grade in a heated building is 75 mm.",
    reference: "Carpentry Textbook, Chapter 5",
    bcbc_reference: "BCBC 2024 9.16.4.2",
    category: "Foundations"
  },
  {
    question: "Which wood species has the highest structural strength rating among the following?",
    options: ["Pine", "Spruce", "Douglas Fir", "Cedar"],
    correct_answer: 2,
    explanation: "Douglas Fir has the highest structural strength rating among these options, making it ideal for load-bearing applications.",
    reference: "Carpentry Textbook, Chapter 3",
    bcbc_reference: "BCBC 2024 Table 9.3.2.1",
    category: "Materials"
  },
  {
    question: "What is the minimum height of a guard rail for a residential deck more than 1.8 m above grade?",
    options: ["900 mm", "1070 mm", "1220 mm", "1500 mm"],
    correct_answer: 1,
    explanation: "The minimum height of a guard rail for a residential deck more than 1.8 m above grade is 1070 mm.",
    reference: "Carpentry Textbook, Chapter 12",
    bcbc_reference: "BCBC 2024 9.8.8.3",
    category: "Finishing"
  },
  {
    question: "What is the maximum allowable rise for a single step in a residential staircase?",
    options: ["175 mm", "200 mm", "220 mm", "250 mm"],
    correct_answer: 1,
    explanation: "The maximum allowable rise for a single step in a residential staircase is 200 mm.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.4.1",
    category: "Finishing"
  },
  {
    question: "What type of foundation is most suitable for sites with poor soil conditions?",
    options: ["Slab-on-grade", "Pier foundation", "Pile foundation", "Strip foundation"],
    correct_answer: 2,
    explanation: "Pile foundations are most suitable for sites with poor soil conditions as they transfer loads to more stable soil or rock at greater depths.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.15.1.1",
    category: "Foundations"
  },
  {
    question: "What is the purpose of a vapor barrier in wall construction?",
    options: ["To provide structural support", "To prevent moisture transmission", "To add insulation value", "To block sound transmission"],
    correct_answer: 1,
    explanation: "The primary purpose of a vapor barrier is to prevent moisture transmission through the wall assembly, protecting insulation and preventing condensation within the wall cavity.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 9.25.4.1",
    category: "Insulation"
  },
  {
    question: "What is the minimum required R-value for exterior walls in Climate Zone 6 (most of BC)?",
    options: ["R-16", "R-20", "R-24", "R-28"],
    correct_answer: 2,
    explanation: "The minimum required R-value for exterior walls in Climate Zone 6 is R-24.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 Table 9.36.2.6.A",
    category: "Insulation"
  },
  {
    question: "What is the required spacing for 16d common nails when fastening wall studs to a single bottom plate?",
    options: ["3 nails per stud", "2 nails per stud", "16 inches on center", "24 inches on center"],
    correct_answer: 0,
    explanation: "The standard requirement is 3 16d common nails per stud when fastening to a single bottom plate, ensuring adequate structural connection.",
    reference: "Carpentry Textbook, Chapter 7",
    bcbc_reference: "BCBC 2024 9.23.3.4",
    category: "Framing"
  },
  {
    question: "When installing engineered I-joists, what is the maximum allowed notch depth in the top or bottom flange?",
    options: ["No notching allowed", "1/4 of flange width", "1/3 of flange width", "1/2 of flange width"],
    correct_answer: 0,
    explanation: "Engineered I-joists must not have any notches in the top or bottom flanges as this significantly compromises their structural integrity.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 9.23.4.2",
    category: "Framing"
  },
  {
    question: "What is the minimum required width for a primary egress stairway in a residential building?",
    options: ["760 mm", "860 mm", "910 mm", "1100 mm"],
    correct_answer: 1,
    explanation: "The minimum width for a primary egress stairway in residential construction is 860 mm to ensure safe passage during emergencies.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.2.1",
    category: "Finishing"
  },
  {
    question: "What is the maximum riser height allowed for residential stairs?",
    options: ["150 mm", "175 mm", "200 mm", "210 mm"],
    correct_answer: 2,
    explanation: "The maximum allowed riser height for residential stairs is 200 mm, ensuring comfortable and safe stair dimensions.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.4.1",
    category: "Finishing"
  },
  {
    question: "When installing roof sheathing, what is the recommended gap between panels for expansion?",
    options: ["No gap required", "1/8 inch (3 mm)", "1/4 inch (6 mm)", "1/2 inch (12 mm)"],
    correct_answer: 1,
    explanation: "A 1/8 inch (3 mm) gap between roof sheathing panels is recommended to allow for expansion due to moisture and temperature changes.",
    reference: "Carpentry Textbook, Chapter 10",
    bcbc_reference: "BCBC 2024 9.23.16.2",
    category: "Framing"
  },
  {
    question: "What is the minimum required insulation value (RSI) for cathedral ceilings in Climate Zone 6?",
    options: ["RSI 4.67", "RSI 5.67", "RSI 6.91", "RSI 8.67"],
    correct_answer: 2,
    explanation: "The minimum required insulation value for cathedral ceilings in Climate Zone 6 is RSI 6.91, which is equivalent to about R-39.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 Table 9.36.2.6.A",
    category: "Insulation"
  },
  {
    question: "What is the maximum allowable deflection for a floor joist with plaster ceiling below?",
    options: ["L/360", "L/240", "L/180", "L/480"],
    correct_answer: 3,
    explanation: "The maximum allowable deflection for a floor joist with a plaster ceiling below is L/480, where L is the span length, to prevent cracking of the plaster.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 9.4.3.1",
    category: "Framing"
  },
  {
    question: "When installing a water-resistant barrier behind exterior cladding, what is the minimum required overlap at horizontal joints?",
    options: ["50 mm", "100 mm", "150 mm", "200 mm"],
    correct_answer: 1,
    explanation: "The minimum required overlap at horizontal joints when installing a water-resistant barrier is 100 mm to ensure proper moisture protection.",
    reference: "Carpentry Textbook, Chapter 13",
    bcbc_reference: "BCBC 2024 9.27.3.4",
    category: "Building Code"
  },
  {
    question: "What is the minimum required thickness for plywood subfloor with joists spaced at 400 mm (16\") on center?",
    options: ["12.5 mm", "15.5 mm", "18.5 mm", "20.5 mm"],
    correct_answer: 1,
    explanation: "The minimum required thickness for plywood subfloor with joists spaced at 400 mm (16\") on center is 15.5 mm for adequate support.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 Table 9.23.15.5.A",
    category: "Materials"
  },
  {
    question: "What is the minimum height of a smoke detector from the peak of a cathedral ceiling?",
    options: ["100 mm", "300 mm", "500 mm", "900 mm"],
    correct_answer: 2,
    explanation: "The minimum height of a smoke detector from the peak of a cathedral ceiling is 500 mm to avoid dead air space where smoke may not reach.",
    reference: "Carpentry Textbook, Chapter 15",
    bcbc_reference: "BCBC 2024 9.10.19.3",
    category: "Building Code"
  }
];

async function recreateQuestionsWithCategories() {
  try {
    console.log('Deleting all existing questions from Supabase...');
    
    // Delete all existing questions
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) {
      console.error('Error deleting questions:', deleteError);
      return;
    }
    
    console.log('All existing questions deleted.');
    console.log(`Adding ${questionsWithCategories.length} questions with categories...`);
    
    // Add all questions with categories
    const { data, error } = await supabase
      .from('questions')
      .insert(questionsWithCategories)
      .select();
    
    if (error) {
      console.error('Error adding questions with categories:', error);
      return;
    }
    
    console.log('Successfully added questions with categories!');
    console.log(`Added ${data.length} questions`);
    
    // Count questions by category
    const categoryCounts = {};
    questionsWithCategories.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });
    
    console.log('Questions by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`${category}: ${count} questions`);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the recreate function
recreateQuestionsWithCategories(); 