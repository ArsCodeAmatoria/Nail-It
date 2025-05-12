'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  reference: string
  bcbc_reference: string
}

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id')
      
      if (error) {
        console.error('Error fetching questions:', error)
        return
      }
      
      setQuestions(data || [])
    }

    fetchQuestions()
  }, [])

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-muted">Loading questions...</div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={selectedAnswer === index
                      ? index === question.correct_answer
                        ? "default"
                        : "destructive"
                      : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">{question.explanation}</p>
                
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Reference:</span> {question.reference}</p>
                  <p><span className="font-medium">BCBC 2024:</span> {question.bcbc_reference}</p>
                </div>

                <Button
                  onClick={handleNextQuestion}
                  className="mt-6"
                >
                  Next Question
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
} 