import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check for environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Questions to add to the database - without manually specifying IDs
const questions = [
  {
    question: "What is the minimum required depth for a footing in a heated building in BC?",
    options: ["300 mm", "450 mm", "600 mm", "900 mm"],
    correct_answer: 2,
    explanation: "The minimum depth for a footing in a heated building is 600 mm to prevent frost heave.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.12.2.2"
  },
  {
    question: "Which fastener is best for joining two pieces of dimensional lumber in framing?",
    options: ["Drywall screw", "Common nail", "Finishing nail", "Brad nail"],
    correct_answer: 1,
    explanation: "Common nails are used for structural framing connections.",
    reference: "Carpentry Textbook, Chapter 7",
    bcbc_reference: "BCBC 2024 9.23.3.3"
  },
  {
    question: "What is the standard spacing for roof trusses in residential construction?",
    options: ["12 inches", "16 inches", "24 inches", "36 inches"],
    correct_answer: 2,
    explanation: "The standard spacing for roof trusses in residential construction is 24 inches (610 mm) on center.",
    reference: "Carpentry Textbook, Chapter 10",
    bcbc_reference: "BCBC 2024 9.23.14.2"
  },
  {
    question: "What is the minimum thickness for a concrete slab on grade in a heated building?",
    options: ["75 mm", "100 mm", "125 mm", "150 mm"],
    correct_answer: 0,
    explanation: "The minimum thickness for a concrete slab on grade in a heated building is 75 mm.",
    reference: "Carpentry Textbook, Chapter 5",
    bcbc_reference: "BCBC 2024 9.16.4.2"
  },
  {
    question: "Which wood species has the highest structural strength rating among the following?",
    options: ["Pine", "Spruce", "Douglas Fir", "Cedar"],
    correct_answer: 2,
    explanation: "Douglas Fir has the highest structural strength rating among these options, making it ideal for load-bearing applications.",
    reference: "Carpentry Textbook, Chapter 3",
    bcbc_reference: "BCBC 2024 Table 9.3.2.1"
  },
  {
    question: "What is the minimum height of a guard rail for a residential deck more than 1.8 m above grade?",
    options: ["900 mm", "1070 mm", "1220 mm", "1500 mm"],
    correct_answer: 1,
    explanation: "The minimum height of a guard rail for a residential deck more than 1.8 m above grade is 1070 mm.",
    reference: "Carpentry Textbook, Chapter 12",
    bcbc_reference: "BCBC 2024 9.8.8.3"
  },
  {
    question: "What is the maximum allowable rise for a single step in a residential staircase?",
    options: ["175 mm", "200 mm", "220 mm", "250 mm"],
    correct_answer: 1,
    explanation: "The maximum allowable rise for a single step in a residential staircase is 200 mm.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.4.1"
  },
  {
    question: "What type of foundation is most suitable for sites with poor soil conditions?",
    options: ["Slab-on-grade", "Pier foundation", "Pile foundation", "Strip foundation"],
    correct_answer: 2,
    explanation: "Pile foundations are most suitable for sites with poor soil conditions as they transfer loads to more stable soil or rock at greater depths.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.15.1.1"
  },
  {
    question: "What is the purpose of a vapor barrier in wall construction?",
    options: ["To provide structural support", "To prevent moisture transmission", "To add insulation value", "To block sound transmission"],
    correct_answer: 1,
    explanation: "The primary purpose of a vapor barrier is to prevent moisture transmission through the wall assembly, protecting insulation and preventing condensation within the wall cavity.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 9.25.4.1"
  },
  {
    question: "What is the minimum required R-value for exterior walls in Climate Zone 6 (most of BC)?",
    options: ["R-16", "R-20", "R-24", "R-28"],
    correct_answer: 2,
    explanation: "The minimum required R-value for exterior walls in Climate Zone 6 is R-24.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 Table 9.36.2.6.A"
  }
];

async function seedQuestions() {
  try {
    console.log('Starting to seed questions to Supabase...');
    
    // Add all questions
    console.log(`Adding ${questions.length} questions...`);
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();
    
    if (error) {
      console.error('Error adding questions:', error);
      return;
    }
    
    console.log('Successfully added questions to Supabase!');
    console.log(`Added ${data.length} questions`);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the seeder
seedQuestions(); 