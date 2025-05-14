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

// Additional advanced questions to add to the database
const questions = [
  {
    question: "What is the required spacing for 16d common nails when fastening wall studs to a single bottom plate?",
    options: ["3 nails per stud", "2 nails per stud", "16 inches on center", "24 inches on center"],
    correct_answer: 0,
    explanation: "The standard requirement is 3 16d common nails per stud when fastening to a single bottom plate, ensuring adequate structural connection.",
    reference: "Carpentry Textbook, Chapter 7",
    bcbc_reference: "BCBC 2024 9.23.3.4"
  },
  {
    question: "When installing engineered I-joists, what is the maximum allowed notch depth in the top or bottom flange?",
    options: ["No notching allowed", "1/4 of flange width", "1/3 of flange width", "1/2 of flange width"],
    correct_answer: 0,
    explanation: "Engineered I-joists must not have any notches in the top or bottom flanges as this significantly compromises their structural integrity.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 9.23.4.2"
  },
  {
    question: "What is the minimum required width for a primary egress stairway in a residential building?",
    options: ["760 mm", "860 mm", "910 mm", "1100 mm"],
    correct_answer: 1,
    explanation: "The minimum width for a primary egress stairway in residential construction is 860 mm to ensure safe passage during emergencies.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.2.1"
  },
  {
    question: "What is the maximum riser height allowed for residential stairs?",
    options: ["150 mm", "175 mm", "200 mm", "210 mm"],
    correct_answer: 2,
    explanation: "The maximum allowed riser height for residential stairs is 200 mm, ensuring comfortable and safe stair dimensions.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.4.1"
  },
  {
    question: "When installing roof sheathing, what is the recommended gap between panels for expansion?",
    options: ["No gap required", "1/8 inch (3 mm)", "1/4 inch (6 mm)", "1/2 inch (12 mm)"],
    correct_answer: 1,
    explanation: "A 1/8 inch (3 mm) gap between roof sheathing panels is recommended to allow for expansion due to moisture and temperature changes.",
    reference: "Carpentry Textbook, Chapter 10",
    bcbc_reference: "BCBC 2024 9.23.16.2"
  },
  {
    question: "What is the minimum required insulation value (RSI) for cathedral ceilings in Climate Zone 6?",
    options: ["RSI 4.67", "RSI 5.67", "RSI 6.91", "RSI 8.67"],
    correct_answer: 2,
    explanation: "The minimum required insulation value for cathedral ceilings in Climate Zone 6 is RSI 6.91, which is equivalent to about R-39.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 Table 9.36.2.6.A"
  },
  {
    question: "What is the maximum allowable deflection for a floor joist with plaster ceiling below?",
    options: ["L/360", "L/240", "L/180", "L/480"],
    correct_answer: 3,
    explanation: "The maximum allowable deflection for a floor joist with a plaster ceiling below is L/480, where L is the span length, to prevent cracking of the plaster.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 9.4.3.1"
  },
  {
    question: "When installing a water-resistant barrier behind exterior cladding, what is the minimum required overlap at horizontal joints?",
    options: ["50 mm", "100 mm", "150 mm", "200 mm"],
    correct_answer: 1,
    explanation: "The minimum required overlap at horizontal joints when installing a water-resistant barrier is 100 mm to ensure proper moisture protection.",
    reference: "Carpentry Textbook, Chapter 13",
    bcbc_reference: "BCBC 2024 9.27.3.4"
  },
  {
    question: "What is the minimum required thickness for plywood subfloor with joists spaced at 400 mm (16\") on center?",
    options: ["12.5 mm", "15.5 mm", "18.5 mm", "20.5 mm"],
    correct_answer: 1,
    explanation: "The minimum required thickness for plywood subfloor with joists spaced at 400 mm (16\") on center is 15.5 mm for adequate support.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 Table 9.23.15.5.A"
  },
  {
    question: "What is the minimum height of a smoke detector from the peak of a cathedral ceiling?",
    options: ["100 mm", "300 mm", "500 mm", "900 mm"],
    correct_answer: 2,
    explanation: "The minimum height of a smoke detector from the peak of a cathedral ceiling is 500 mm to avoid dead air space where smoke may not reach.",
    reference: "Carpentry Textbook, Chapter 15",
    bcbc_reference: "BCBC 2024 9.10.19.3"
  }
];

async function seedMoreQuestions() {
  try {
    console.log('Starting to seed additional questions to Supabase...');
    
    // Add all questions
    console.log(`Adding ${questions.length} more questions...`);
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();
    
    if (error) {
      console.error('Error adding questions:', error);
      return;
    }
    
    console.log('Successfully added additional questions to Supabase!');
    console.log(`Added ${data.length} more questions`);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the seeder
seedMoreQuestions(); 