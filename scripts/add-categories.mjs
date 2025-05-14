import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hvsvmxrktlmtywxwbwdd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2c3ZteHJrdGxtdHl3eHdid2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODc1ODIsImV4cCI6MjA2MjY2MzU4Mn0.9nwvTupvFoTJVWWtoXtNnQ-vj73vy1dx91uLjzChJ98';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the question categories
const categories = {
  'Foundations': ['footing', 'foundation', 'slab', 'concrete', 'soil'],
  'Framing': ['framing', 'stud', 'joist', 'lumber', 'nail', 'fastener', 'truss', 'sheathing', 'I-joist'],
  'Insulation': ['insulation', 'R-value', 'RSI', 'vapor barrier'],
  'Finishing': ['guard rail', 'stair', 'staircase', 'riser', 'smoke detector'],
  'Materials': ['wood', 'species', 'Douglas Fir', 'Pine', 'Spruce', 'Cedar', 'plywood'],
  'Building Code': ['BCBC', 'code', 'minimum', 'maximum', 'requirement']
};

async function addCategoriesToQuestions() {
  try {
    console.log('Fetching existing questions from Supabase...');
    
    // Get all questions
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching questions:', fetchError);
      return;
    }
    
    console.log(`Found ${questions.length} questions. Adding primary categories...`);
    
    // Process each question to determine its category
    const updatedQuestions = questions.map(question => {
      // Find matching categories based on keywords in the question
      const matchedCategories = Object.entries(categories).filter(([category, keywords]) => {
        return keywords.some(keyword => 
          question.question.toLowerCase().includes(keyword.toLowerCase()) || 
          (question.explanation && question.explanation.toLowerCase().includes(keyword.toLowerCase()))
        );
      }).map(([category]) => category);
      
      // Add a primary category (first match or 'General' if no match)
      const primaryCategory = matchedCategories.length > 0 ? matchedCategories[0] : 'General';
      
      return {
        id: question.id,
        category: primaryCategory
      };
    });
    
    console.log('Updating questions with primary categories...');
    
    // Update questions with primary category
    for (const question of updatedQuestions) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({ category: question.category })
        .eq('id', question.id);
      
      if (updateError) {
        console.error(`Error updating question ${question.id}:`, updateError);
      } else {
        console.log(`Updated question ${question.id} with category: ${question.category}`);
      }
    }
    
    console.log('Successfully added categories to questions!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update function
addCategoriesToQuestions(); 