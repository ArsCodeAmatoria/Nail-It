'use client'

import { useState, useEffect, useRef } from 'react'
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
  Award,
  Clock,
  Home,
  CheckSquare
} from 'lucide-react'
import Link from 'next/link'

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
  }
];

const EXAM_DURATION_MINUTES = 30;
const QUESTIONS_PER_EXAM = 10;

export default function ExamMode() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION_MINUTES * 60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [score, setScore] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('id')
        
        if (error) {
          console.error('Error fetching questions:', error)
          setError(`Failed to load questions: ${error.message}`);
          setQuestions(SAMPLE_QUESTIONS);
          return
        }
        
        if (data && data.length > 0) {
          setQuestions(data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map(q => q.category || 'Uncategorized'))
          ).sort();
          setCategories(uniqueCategories);
        } else {
          console.log('No questions found in database, using samples');
          setQuestions(SAMPLE_QUESTIONS);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setQuestions(SAMPLE_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions()
  }, [])

  const startExam = () => {
    // Select random questions for the exam
    let questionsPool = questions;
    
    // Filter by category if selected
    if (selectedCategory) {
      questionsPool = questions.filter(q => (q.category || 'Uncategorized') === selectedCategory);
    }
    
    // If not enough questions in category, use all available
    if (questionsPool.length < QUESTIONS_PER_EXAM) {
      setExamQuestions(questionsPool);
      setSelectedAnswers(Array(questionsPool.length).fill(null));
    } else {
      // Randomly select questions
      const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, QUESTIONS_PER_EXAM);
      setExamQuestions(selected);
      setSelectedAnswers(Array(QUESTIONS_PER_EXAM).fill(null));
    }
    
    setExamStarted(true);
    setCurrentQuestion(0);
    setRemainingTime(EXAM_DURATION_MINUTES * 60);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleAnswerSelect = (index: number) => {
    if (examFinished) return;
    
    // Update selected answer for current question
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = index;
    setSelectedAnswers(updatedAnswers);
  }

  const handleNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishExam();
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }

  const finishExam = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate score
    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === examQuestions[index]?.correct_answer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setExamFinished(true);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const restartExam = () => {
    setExamStarted(false);
    setExamFinished(false);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setScore(0);
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
          <p className="text-muted-foreground">Preparing your carpentry exam materials...</p>
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

  // Exam start screen
  if (!examStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pt-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-medium">
            <Home size={16} />
            Back to Home
          </Link>
          
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="text-2xl">Carpenter Certification Exam Simulation</CardTitle>
              <CardDescription>
                Test your knowledge under exam-like conditions
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">Exam Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      <span>Duration: {EXAM_DURATION_MINUTES} minutes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckSquare size={16} className="text-primary" />
                      <span>Questions: {QUESTIONS_PER_EXAM} multiple choice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award size={16} className="text-primary" />
                      <span>Passing score: 70%</span>
                    </li>
                  </ul>
                </div>
                
                {categories.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Select Category (Optional)</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="rounded-full"
                        >
                          {category}
                        </Button>
                      ))}
                      
                      {selectedCategory && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="rounded-full"
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-secondary/5 p-4 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">Instructions</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Read each question carefully before selecting an answer</li>
                    <li>• You can navigate between questions using the previous and next buttons</li>
                    <li>• The exam will automatically end when the time expires</li>
                    <li>• You can submit your exam early by clicking "Finish Exam" on the last question</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-secondary/5 py-4 flex justify-end">
              <Button
                onClick={startExam}
                className="gap-2"
                disabled={questions.length === 0}
              >
                Start Exam
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  // Exam results screen
  if (examFinished) {
    const percentage = Math.round((score / examQuestions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pt-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className={`border-b pb-4 ${passed ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Exam Results</CardTitle>
                <div className={`text-lg font-bold ${passed ? 'text-green-500' : 'text-destructive'}`}>
                  {passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
              <CardDescription>
                {passed 
                  ? "Congratulations! You've passed the exam simulation." 
                  : "Keep practicing! You didn't meet the passing threshold."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{percentage}%</div>
                      <div className="text-muted-foreground">Score</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">Score Breakdown</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Correct Answers:</span>
                      <span className="font-medium">{score}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Incorrect Answers:</span>
                      <span className="font-medium">{examQuestions.length - score}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="font-medium">{examQuestions.length}</span>
                    </li>
                    <li className="flex justify-between border-t pt-2 mt-2">
                      <span>Passing Threshold:</span>
                      <span className="font-medium">70%</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Question Review</h3>
                  {examQuestions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex gap-2 items-start">
                        <div className="mt-0.5">
                          {selectedAnswers[index] === question.correct_answer ? (
                            <CheckCircle2 className="text-green-500 h-5 w-5" />
                          ) : (
                            <XCircle className="text-destructive h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedAnswers[index] === question.correct_answer
                              ? "Correct: "
                              : "Incorrect. Correct answer: "}
                            {question.options[question.correct_answer]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-secondary/5 py-4 flex justify-between">
              <Button
                variant="outline"
                onClick={restartExam}
                className="gap-2"
              >
                <RotateCcw size={16} />
                Take Another Exam
              </Button>
              
              <Link href="/">
                <Button className="gap-2">
                  <Home size={16} />
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  // Actual exam screen
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pt-8 pb-16 px-4">
      {/* Exam navigation and timer */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="w-full bg-card border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Question</p>
              <p className="font-medium">{currentQuestion + 1} of {examQuestions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              remainingTime < 60 ? 'bg-destructive/20 animate-pulse' : 'bg-primary/10'
            }`}>
              <Clock size={20} className={remainingTime < 60 ? 'text-destructive' : 'text-primary'} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className={`font-medium ${remainingTime < 60 ? 'text-destructive' : ''}`}>
                {formatTime(remainingTime)}
              </p>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={finishExam}
            className="gap-2"
          >
            <CheckSquare size={14} />
            Finish Exam
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
                <CardTitle className="text-2xl">{examQuestions[currentQuestion]?.question}</CardTitle>
                {examQuestions[currentQuestion]?.category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {examQuestions[currentQuestion]?.category}
                  </span>
                )}
              </div>
              <CardDescription>
                Select the correct answer from the options below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-3">
                {examQuestions[currentQuestion]?.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Button
                      variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                      className="w-full justify-start h-auto py-4 px-4 text-left"
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedAnswers[currentQuestion] === index ? 'bg-primary' : 'bg-secondary'
                        }`}>
                          <span className="text-sm font-medium text-white">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <span className="mt-0.5">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-secondary/5 py-4 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                className="gap-2"
              >
                {currentQuestion === examQuestions.length - 1 ? 'Finish Exam' : 'Next'}
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Question navigation dots */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {examQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  currentQuestion === index 
                    ? 'bg-primary text-white' 
                    : selectedAnswers[index] !== null
                      ? 'bg-primary/30 text-white'
                      : 'bg-secondary text-primary-foreground'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  )
} 