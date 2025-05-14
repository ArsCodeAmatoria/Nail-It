'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  AlertCircle,
  BookOpen,
  Lightbulb,
  Code,
  RotateCcw,
  Loader2,
  BarChart3,
  Award
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  reference: string
  bcbc_reference: string
  category?: string
}

// Sample questions to show if Supabase fails to load
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the minimum required depth for a footing in a heated building in BC?",
    options: ["300 mm", "450 mm", "600 mm", "900 mm"],
    correct_answer: 2,
    explanation: "The minimum depth for a footing in a heated building is 600 mm to prevent frost heave.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.12.2.2",
    category: "Foundations"
  },
  {
    id: 2,
    question: "Which fastener is best for joining two pieces of dimensional lumber in framing?",
    options: ["Drywall screw", "Common nail", "Finishing nail", "Brad nail"],
    correct_answer: 1,
    explanation: "Common nails are used for structural framing connections.",
    reference: "Carpentry Textbook, Chapter 7",
    bcbc_reference: "BCBC 2024 9.23.3.3",
    category: "Framing"
  },
  {
    id: 3,
    question: "What is the standard spacing for roof trusses in residential construction?",
    options: ["12 inches", "16 inches", "24 inches", "36 inches"],
    correct_answer: 2,
    explanation: "The standard spacing for roof trusses in residential construction is 24 inches (610 mm) on center.",
    reference: "Carpentry Textbook, Chapter 10",
    bcbc_reference: "BCBC 2024 9.23.14.2",
    category: "Framing"
  },
  {
    id: 4,
    question: "What is the minimum thickness for a concrete slab on grade in a heated building?",
    options: ["75 mm", "100 mm", "125 mm", "150 mm"],
    correct_answer: 0,
    explanation: "The minimum thickness for a concrete slab on grade in a heated building is 75 mm.",
    reference: "Carpentry Textbook, Chapter 5",
    bcbc_reference: "BCBC 2024 9.16.4.2",
    category: "Foundations"
  },
  {
    id: 5,
    question: "Which wood species has the highest structural strength rating among the following?",
    options: ["Pine", "Spruce", "Douglas Fir", "Cedar"],
    correct_answer: 2,
    explanation: "Douglas Fir has the highest structural strength rating among these options, making it ideal for load-bearing applications.",
    reference: "Carpentry Textbook, Chapter 3",
    bcbc_reference: "BCBC 2024 Table 9.3.2.1",
    category: "Materials"
  },
  {
    id: 6,
    question: "What is the minimum height of a guard rail for a residential deck more than 1.8 m above grade?",
    options: ["900 mm", "1070 mm", "1220 mm", "1500 mm"],
    correct_answer: 1,
    explanation: "The minimum height of a guard rail for a residential deck more than 1.8 m above grade is 1070 mm.",
    reference: "Carpentry Textbook, Chapter 12",
    bcbc_reference: "BCBC 2024 9.8.8.3",
    category: "Finishing"
  },
  {
    id: 7,
    question: "What is the maximum allowable rise for a single step in a residential staircase?",
    options: ["175 mm", "200 mm", "220 mm", "250 mm"],
    correct_answer: 1,
    explanation: "The maximum allowable rise for a single step in a residential staircase is 200 mm.",
    reference: "Carpentry Textbook, Chapter 11",
    bcbc_reference: "BCBC 2024 9.8.4.1",
    category: "Finishing"
  },
  {
    id: 8,
    question: "What type of foundation is most suitable for sites with poor soil conditions?",
    options: ["Slab-on-grade", "Pier foundation", "Pile foundation", "Strip foundation"],
    correct_answer: 2,
    explanation: "Pile foundations are most suitable for sites with poor soil conditions as they transfer loads to more stable soil or rock at greater depths.",
    reference: "Carpentry Textbook, Chapter 4",
    bcbc_reference: "BCBC 2024 9.15.1.1",
    category: "Foundations"
  },
  {
    id: 9,
    question: "What is the purpose of a vapor barrier in wall construction?",
    options: ["To provide structural support", "To prevent moisture transmission", "To add insulation value", "To block sound transmission"],
    correct_answer: 1,
    explanation: "The primary purpose of a vapor barrier is to prevent moisture transmission through the wall assembly, protecting insulation and preventing condensation within the wall cavity.",
    reference: "Carpentry Textbook, Chapter 8",
    bcbc_reference: "BCBC 2024 9.25.4.1",
    category: "Insulation"
  },
  {
    id: 10,
    question: "What is the minimum required R-value for exterior walls in Climate Zone 6 (most of BC)?",
    options: ["R-16", "R-20", "R-24", "R-28"],
    correct_answer: 2,
    explanation: "The minimum required R-value for exterior walls in Climate Zone 6 is R-24.",
    reference: "Carpentry Textbook, Chapter 9",
    bcbc_reference: "BCBC 2024 Table 9.36.2.6.A",
    category: "Insulation"
  }
];

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('id')
        
        console.log('Fetched data:', data)
        console.log('Error:', error)
        
        if (error) {
          console.error('Error fetching questions:', error)
          setError(`Failed to load questions: ${error.message}`);
          // Use sample questions if Supabase fails
          setQuestions(SAMPLE_QUESTIONS);
          setFilteredQuestions(SAMPLE_QUESTIONS);
          return
        }
        
        if (data && data.length > 0) {
          setQuestions(data);
          setFilteredQuestions(data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map(q => q.category || 'Uncategorized'))
          ).sort();
          setCategories(uniqueCategories);
        } else {
          console.log('No questions found in database, using samples');
          // If no questions in database, use sample questions
          setQuestions(SAMPLE_QUESTIONS);
          setFilteredQuestions(SAMPLE_QUESTIONS);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        // Fallback to sample questions
        setQuestions(SAMPLE_QUESTIONS);
        setFilteredQuestions(SAMPLE_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions()
  }, [])

  // Filter questions when category changes
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(q => 
        (q.category || 'Uncategorized') === selectedCategory
      );
      setFilteredQuestions(filtered);
    }
    
    // Reset current question and stats when category changes
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuestionsAnswered(0);
  }, [selectedCategory, questions]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    
    // Update score and questions answered
    if (index === filteredQuestions[currentQuestion].correct_answer) {
      setScore(prev => prev + 1)
    }
    setQuestionsAnswered(prev => prev + 1)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCurrentQuestion((prev) => (prev + 1) % filteredQuestions.length)
  }

  const handleRestart = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCurrentQuestion(0)
    setScore(0)
    setQuestionsAnswered(0)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={48} className="animate-spin text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-ping opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Loading Questions</h3>
          <p className="text-muted-foreground">Preparing your carpentry practice materials...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-destructive/5 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-xl bg-destructive/10 text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-destructive" />
          <h3 className="text-2xl font-bold mb-2 text-destructive">Connection Error</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-xl bg-secondary/10 text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-secondary" />
          <h3 className="text-2xl font-bold mb-2">No Questions Found</h3>
          <p className="text-muted-foreground mb-6">
            {selectedCategory ? 
              `No questions found in the "${selectedCategory}" category. Please select a different category.` :
              "We couldn't find any practice questions. Please check your database connection or add questions."
            }
          </p>
          {selectedCategory ? (
            <Button 
              onClick={() => setSelectedCategory(null)}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw size={16} />
              Show All Categories
            </Button>
          ) : (
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw size={16} />
              Reload
            </Button>
          )}
        </motion.div>
      </div>
    )
  }

  const question = filteredQuestions[currentQuestion]
  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pt-8 pb-16 px-4">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="w-full bg-card border rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(null)}
                className="rounded-full"
              >
                All Categories
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="w-full bg-card border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Question</p>
              <p className="font-medium">{currentQuestion + 1} of {filteredQuestions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-medium">{score}/{questionsAnswered} ({accuracy}%)</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRestart}
            className="gap-2"
          >
            <RotateCcw size={14} />
            Restart
          </Button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{question.question}</CardTitle>
                {question.category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {question.category}
                  </span>
                )}
              </div>
              <CardDescription>
                Select the correct answer from the options below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: selectedAnswer === null ? 1.01 : 1 }}
                  >
                    <Button
                      variant={selectedAnswer === null 
                        ? "outline" 
                        : selectedAnswer === index
                          ? index === question.correct_answer
                            ? "default"
                            : "destructive"
                          : index === question.correct_answer && selectedAnswer !== null
                            ? "default"
                            : "outline"
                      }
                      className={`w-full justify-start h-auto py-4 px-4 text-left relative ${
                        selectedAnswer !== null && 'cursor-default'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedAnswer === null 
                            ? 'bg-secondary' 
                            : selectedAnswer === index
                              ? index === question.correct_answer
                                ? 'bg-primary'
                                : 'bg-destructive'
                              : index === question.correct_answer && selectedAnswer !== null
                                ? 'bg-primary'
                                : 'bg-secondary'
                        }`}>
                          <span className="text-sm font-medium text-white">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <span className="mt-0.5">{option}</span>
                      </div>
                      
                      {selectedAnswer !== null && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {index === question.correct_answer ? (
                            <CheckCircle2 className="text-primary h-5 w-5" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="text-destructive h-5 w-5" />
                          ) : null}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Card className="border-2 border-primary/10 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <CardTitle>Explanation</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6">{question.explanation}</p>
                    
                    <div className="space-y-3 bg-secondary/5 p-4 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Reference</p>
                          <p className="text-sm text-muted-foreground">{question.reference}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">BC Building Code</p>
                          <p className="text-sm text-muted-foreground">{question.bcbc_reference}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t bg-secondary/5 py-4 flex justify-end">
                    <Button
                      onClick={handleNextQuestion}
                      className="gap-2"
                    >
                      Next Question
                      <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </main>
  )
} 