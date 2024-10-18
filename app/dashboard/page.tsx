'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User as FirebaseUser, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, increment, DocumentData } from "firebase/firestore"
import { useFirebase } from '../../hooks/useFirebase'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Gavel, Lock, CheckCircle, X, Trophy, BookOpen, CheckCircle as CheckCircleIcon, Target, Bookmark, CreditCard } from 'lucide-react'
import { ProgressSlider } from '../../components/ProgressSlider';
import Link from 'next/link'
import { Firestore } from "firebase/firestore"
import { Auth } from "firebase/auth"

// Mock questions for the practice test
const mockQuestions = [
  {
    question: "What is the term for a formal written statement by a defendant in a civil case?",
    options: ["Affidavit", "Deposition", "Answer", "Interrogatory"],
    correctAnswer: "Answer",
    explanation: "An 'Answer' is the formal written statement made by a defendant in a civil case, responding to the plaintiff's complaint."
  },
  {
    question: "In contract law, what is the term for a promise in exchange for a promise?",
    options: ["Consideration", "Bilateral contract", "Unilateral contract", "Offer"],
    correctAnswer: "Bilateral contract",
    explanation: "A 'Bilateral contract' is formed when both parties exchange promises to perform, creating mutual obligations."
  },
  // Add a comma here
  {
    question: "What does 'mens rea' refer to in criminal law?",
    options: ["Guilty act", "Guilty mind", "Self-defense", "Reasonable doubt"],
    correctAnswer: "Guilty mind",
    explanation: "'Mens rea' is Latin for 'guilty mind' and refers to the mental state required to constitute a crime."
  }
]

const lsatTopics = ["Logical Reasoning", "Analytical Reasoning", "Reading Comprehension"];

interface UserProgress extends DocumentData {
  latestTestScore: number;
  totalQuestionsAnswered: number;
  totalTestsCompleted: number;
  displayName: string;
  testID: string;
  RLogicalReasoning: number;
  RAnalyticalReasoning: number;
  RReadingComprehension: number;
  LogicalReasoningTotal: number;
  AnalyticalReasoningTotal: number;
  ReadingComprehensionTotal: number;
}

interface GeneratedQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface FirebaseContextType {
  auth: Auth;
  db: Firestore;
}

function ProgressCard({ progress }: { progress: UserProgress }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500">Latest Score</p>
            <p className="text-xl font-bold">{progress.latestTestScore}</p>
          </div>
          <div className="flex flex-col items-center">
            <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-500">Tests Completed</p>
            <p className="text-xl font-bold">{progress.totalTestsCompleted}</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-500">Questions Answered</p>
            <p className="text-xl font-bold">{progress.totalQuestionsAnswered}</p>
          </div>
          <div className="flex flex-col items-center">
            <Target className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-500">Current Test</p>
            <p className="text-xl font-bold">{progress.testID || 'None'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function useUserProgress(userId: string | null) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    latestTestScore: 0,
    totalQuestionsAnswered: 0,
    totalTestsCompleted: 0,
    displayName: '',
    testID: '',
    RLogicalReasoning: 0,
    RAnalyticalReasoning: 0,
    RReadingComprehension: 0,
    LogicalReasoningTotal: 0,
    AnalyticalReasoningTotal: 0,
    ReadingComprehensionTotal: 0,
  });

  const loadUserProgress = useCallback(async (userId: string) => {
    // Implement your logic to load user progress here
    // For now, we'll just use a placeholder
    console.log("Loading user progress for", userId);
    // setUserProgress(loadedProgress);
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserProgress(userId);
    }
  }, [userId, loadUserProgress]);

  return { userProgress, loadUserProgress };
}

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [showTest, setShowTest] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<GeneratedQuestion[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentGeneratedQuestion, setCurrentGeneratedQuestion] = useState<GeneratedQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const router = useRouter()
  const { auth, db }: FirebaseContextType = useFirebase()
  const { userProgress, loadUserProgress } = useUserProgress(user?.uid ?? null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const ensureUserDocument = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // Create a new user document with default values
      await setDoc(userDocRef, {
        displayName: '',
        latestTestScore: 0,
        totalQuestionsAnswered: 0,
        totalTestsCompleted: 0,
        testID: '',
        RLogicalReasoning: 0,
        RAnalyticalReasoning: 0,
        RReadingComprehension: 0,
        LogicalReasoningTotal: 0,
        AnalyticalReasoningTotal: 0,
        ReadingComprehensionTotal: 0,
        totalGeneratedQuestionsAnswered: 0,
        bookmarkedQuestions: [],
      });
      console.log("Created new user document");
    }
  }, [db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await ensureUserDocument(user.uid);
        await loadUserProgress(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, ensureUserDocument, loadUserProgress]);

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const startTest = () => {
    setShowTest(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
  }

  const handleAnswer = (selected: string) => {
    setSelectedAnswer(selected)
    setShowExplanation(true)
    if (selected === mockQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      handleTestCompletion();
    }
  }

  const handleTopicSelect = async (topic: string) => {
    console.log("Topic selected:", topic);
    setSelectedTopic(topic);
    setIsBookmarked(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (!user) {
      setError("Please sign in to generate questions.");
      return;
    }
    
    await generateNewQuestion(topic);
  };

  const generateNewQuestion = async (topic: string, retries = 3) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Generating new question for topic: ${topic}`);
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Received API response:', data);

      if (!data.result) {
        throw new Error('Invalid API response: missing result');
      }

      const questionData = parseQuestionData(data.result);

      if (questionData) {
        setCurrentGeneratedQuestion(questionData);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsBookmarked(false);
      } else {
        if (retries > 0) {
          console.log(`Retrying question generation. Attempts left: ${retries - 1}`);
          return generateNewQuestion(topic, retries - 1);
        } else {
          throw new Error('Failed to parse question data after multiple attempts');
        }
      }
    } catch (error) {
      console.error('Error generating question:', error);
      setError(`Failed to generate question: ${error instanceof Error ? error.message : String(error)}`);
      setCurrentGeneratedQuestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuestionData = (text: string): GeneratedQuestion | null => {
    console.log("Raw API response:", text);

    try {
      const questionMatch = text.match(/Question:?\s*([\s\S]*?)(?=\n\s*[A-D]\)|\n\s*Correct Answer:)/i);
      const optionsMatch = text.match(/([A-D])\)\s*([\s\S]*?)(?=\n\s*[A-D]\)|\n\s*Correct Answer:|\s*$)/gi);
      const correctAnswerMatch = text.match(/Correct Answer:?\s*([A-D])/i);
      const explanationMatch = text.match(/Explanation:?\s*([\s\S]*?)$/i);

      if (!questionMatch) throw new Error("Failed to parse question");
      if (!optionsMatch || optionsMatch.length !== 4) throw new Error("Failed to parse options");
      if (!correctAnswerMatch) throw new Error("Failed to parse correct answer");
      if (!explanationMatch) throw new Error("Failed to parse explanation");

      const parsedData = {
        question: questionMatch[1].trim(),
        options: optionsMatch.map(option => option.replace(/^[A-D]\)\s*/i, '').trim()),
        correctAnswer: correctAnswerMatch[1],
        explanation: explanationMatch[1].trim()
      };

      console.log("Parsed question data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing question data:", error);
      console.error("Problematic text:", text);
      return null;
    }
  };

  const handleGeneratedAnswer = async (option: string) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
    if (user && currentGeneratedQuestion && selectedTopic) {
      const userDocRef = doc(db, 'users', user.uid);
      const updateData: any = {
        totalGeneratedQuestionsAnswered: increment(1),
      };

      const topicField = selectedTopic.replace(/\s+/g, '');
      updateData[`${topicField}Total`] = increment(1);

      const isCorrect = option === currentGeneratedQuestion.correctAnswer;
      if (isCorrect) {
        updateData[`R${topicField}`] = increment(1);
      }

      try {
        await updateDoc(userDocRef, updateData);
        
        loadUserProgress(user.uid);
      } catch (error) {
        console.error("Error updating user progress:", error);
      }
    }
  };

  const bookmarkQuestion = async () => {
    if (user && currentGeneratedQuestion) {
      setIsBookmarked(!isBookmarked);
      const updatedBookmarks = isBookmarked
        ? bookmarkedQuestions.filter(q => q.id !== currentGeneratedQuestion.id)
        : [...bookmarkedQuestions, currentGeneratedQuestion];
      setBookmarkedQuestions(updatedBookmarks);
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          bookmarkedQuestions: updatedBookmarks,
        });
      } catch (error) {
        console.error("Error updating bookmarks:", error);
      }
    }
  };

  const handleTestCompletion = async () => {
    setShowTest(false);
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        latestTestScore: correctAnswers,
        totalQuestionsAnswered: increment(mockQuestions.length),
        totalTestsCompleted: increment(1)
      });
      await loadUserProgress(user.uid);
    }
  };

  useEffect(() => {
    console.log('currentGeneratedQuestion updated:', currentGeneratedQuestion);
  }, [currentGeneratedQuestion]);

  useEffect(() => {
    if (user && showExplanation) {
      loadUserProgress(user.uid);
    }
  }, [showExplanation, user, loadUserProgress]);

  if (!user) {
    return <div>Loading...</div>
  }

  console.log('Selected Topic:', selectedTopic);
  console.log('Current Generated Question:', currentGeneratedQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Gavel className="h-8 w-8 mr-2 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lawerify Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/upgrade">
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" /> Upgrade
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
        
        {showTest ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {mockQuestions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{mockQuestions[currentQuestion].question}</p>
              <div className="space-y-2">
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="mb-4">
                    <Button
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left justify-start ${
                        selectedAnswer === option ? 'bg-gray-200' : ''
                      }`}
                      variant="outline"
                      disabled={showExplanation}
                    >
                      {option}
                      {showExplanation && option === mockQuestions[currentQuestion].correctAnswer && (
                        <CheckCircle className="ml-2 text-green-500" />
                      )}
                      {showExplanation && selectedAnswer === option && option !== mockQuestions[currentQuestion].correctAnswer && (
                        <X className="ml-2 text-red-500" />
                      )}
                    </Button>
                    {showExplanation && selectedAnswer === option && option !== mockQuestions[currentQuestion].correctAnswer && (
                      <p className="text-red-500 mt-2">{mockQuestions[currentQuestion].explanation}</p>
                    )}
                  </div>
                ))}
              </div>
              {showExplanation && (
                <Button onClick={nextQuestion} className="mt-4">
                  {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Test'}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome, {user.email}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is your personal dashboard. Here you can manage your cases, appointments, and take practice tests.</p>
              </CardContent>
            </Card>
            
            <ProgressCard progress={userProgress} />
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Question Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressSlider 
                  label="Logical Reasoning" 
                  correct={userProgress.RLogicalReasoning} 
                  total={userProgress.LogicalReasoningTotal} 
                />
                <ProgressSlider 
                  label="Analytical Reasoning" 
                  correct={userProgress.RAnalyticalReasoning} 
                  total={userProgress.AnalyticalReasoningTotal} 
                />
                <ProgressSlider 
                  label="Reading Comprehension" 
                  correct={userProgress.RReadingComprehension} 
                  total={userProgress.ReadingComprehensionTotal} 
                />
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold mb-4">Practice Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>LSAT Practice Test 1</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProgress.totalTestsCompleted > 0 ? (
                    <>
                      <p>Latest Score: {userProgress.latestTestScore} / {mockQuestions.length}</p>
                      <p>Percentage: {((userProgress.latestTestScore / mockQuestions.length) * 100).toFixed(2)}%</p>
                    </>
                  ) : (
                    <p>You haven&apos;t taken this test yet.</p>
                  )}
                  <Button onClick={startTest} className="mt-4">
                    {userProgress.totalTestsCompleted > 0 ? 'Retake Test' : 'Start Test'}
                  </Button>
                </CardContent>
              </Card>

              {[2, 3, 4, 5].map((testNumber) => (
                <Card key={testNumber} className="mb-4">
                  <CardHeader>
                    <CardTitle>LSAT Practice Test {testNumber}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>This test is locked.</p>
                    <Button disabled className="mt-4">
                      <Lock className="mr-2 h-4 w-4" /> Unlock
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 mt-8">Generated Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {lsatTopics.map((topic) => (
                <Button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  variant={selectedTopic === topic ? "default" : "outline"}
                >
                  {topic}
                </Button>
              ))}
            </div>
            {selectedTopic && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{selectedTopic}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-16 h-16 border-4 border-yellow-400 border-solid rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500">
                      <p>{error}</p>
                      <Button onClick={() => generateNewQuestion(selectedTopic)} className="mt-4">Try Again</Button>
                    </div>
                  ) : currentGeneratedQuestion ? (
                    <div>
                      <p className="mb-4">{currentGeneratedQuestion.question}</p>
                      <div className="space-y-2">
                        {currentGeneratedQuestion.options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleGeneratedAnswer(`${String.fromCharCode(65 + index)}`)}
                            className={`w-full text-left justify-start ${
                              selectedAnswer === `${String.fromCharCode(65 + index)}` ? 'bg-gray-200' : ''
                            }`}
                            variant="outline"
                            disabled={showExplanation}
                          >
                            {`${String.fromCharCode(65 + index)}) ${option}`}
                            {showExplanation && `${String.fromCharCode(65 + index)}` === currentGeneratedQuestion.correctAnswer && (
                              <CheckCircle className="ml-2 text-green-500" />
                            )}
                            {showExplanation && selectedAnswer === `${String.fromCharCode(65 + index)}` && `${String.fromCharCode(65 + index)}` !== currentGeneratedQuestion.correctAnswer && (
                              <X className="ml-2 text-red-500" />
                            )}
                          </Button>
                        ))}
                      </div>
                      {showExplanation && (
                        <div className="mt-4">
                          <p>Correct Answer: {currentGeneratedQuestion.correctAnswer}</p>
                          <p>{currentGeneratedQuestion.explanation}</p>
                          <Button onClick={() => generateNewQuestion(selectedTopic)} className="mt-4">Next Question</Button>
                          <Button 
                            onClick={bookmarkQuestion} 
                            variant="outline"
                            className={`mt-4 ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : ''}`}
                          >
                            <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-yellow-600' : ''}`} /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button onClick={() => generateNewQuestion(selectedTopic)}>Generate Question</Button>
                  )}
                </CardContent>
              </Card>
            )}
            <div className="mt-8">
              <Button onClick={() => router.push('/bookmarks')} variant="outline">
                View Bookmarked Questions
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
