'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User as FirebaseUser, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, increment, DocumentData, FieldValue } from "firebase/firestore"
import { useFirebase } from '../../hooks/useFirebase'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Gavel, Lock, CheckCircle, X, Trophy, BookOpen, CheckCircle as CheckCircleIcon, Target, Bookmark, CreditCard, ArrowLeft } from 'lucide-react'
import { ProgressSlider } from '../../components/ProgressSlider';
import Link from 'next/link'
import { Firestore } from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

// Mock questions for the practice test
const mockQuestions = [
  {
    question: "The passage suggests that the main challenge faced by cities during the Industrial Revolution was:",
    options: [
      "a lack of technological innovation to manage large populations effectively.",
      "environmental degradation caused by suburban sprawl.",
      "the negative health impacts of overcrowding and poor sanitation.",
      "the inefficient use of automobiles, leading to traffic congestion.",
      "the inability to incorporate green spaces into urban planning."
    ],
    correctAnswer: "the negative health impacts of overcrowding and poor sanitation.",
    explanation: "The passage mentions that the rapid growth of cities during the Industrial Revolution 'brought about significant challenges, including overcrowding, poor sanitation, and the spread of disease.'"
  },
  {
    question: "Based on the passage, which of the following best characterizes the relationship between suburban sprawl and the environment?",
    options: [
      "Suburban sprawl reduces the environmental impact of cities by decentralizing populations.",
      "Suburban sprawl has contributed to environmental issues such as increased reliance on automobiles and loss of open land.",
      "Suburban sprawl helps protect natural environments by encouraging more people to live in rural areas.",
      "Suburban sprawl has had little impact on the environment compared to urban development.",
      "Suburban sprawl has primarily improved air quality by reducing the need for urban transportation networks."
    ],
    correctAnswer: "Suburban sprawl has contributed to environmental issues such as increased reliance on automobiles and loss of open land.",
    explanation: "The passage states that 'Suburban sprawl led to increased reliance on automobiles, contributing to traffic congestion, air pollution, and a loss of open land.'"
  },
  {
    question: "The passage suggests that the success of smart cities will depend primarily on:",
    options: [
      "whether they can attract more residents to live in dense urban centers.",
      "their ability to integrate digital technology without compromising privacy or security.",
      "their capacity to provide economic opportunities for suburban populations.",
      "the extent to which they can eliminate the need for traditional infrastructure, such as highways.",
      "their effectiveness in promoting a return to the ideals of early 20th-century urban planning."
    ],
    correctAnswer: "their ability to integrate digital technology without compromising privacy or security.",
    explanation: "The passage discusses both the potential benefits of smart cities and the concerns about privacy and security. The author implies that addressing these concerns will be crucial for the success of smart cities."
  },
  {
    question: "The author mentions the 20th-century suburban boom primarily to illustrate:",
    options: [
      "a period of technological stagnation in urban planning.",
      "how cities were transformed by the widespread use of automobiles.",
      "the success of the Garden City movement in shaping modern suburbs.",
      "the environmental benefits of moving populations away from crowded urban areas.",
      "the challenges cities faced in adapting to new transportation technologies."
    ],
    correctAnswer: "how cities were transformed by the widespread use of automobiles.",
    explanation: "The passage uses the suburban boom as an example of how 'the rise of the automobile further transformed urban environments,' leading to the expansion of cities and changes in living patterns."
  },
  {
    question: "According to the passage, one way in which smart cities could improve energy efficiency is by:",
    options: [
      "promoting the use of public transportation instead of private automobiles.",
      "monitoring and optimizing electricity use through smart energy grids.",
      "encouraging more people to work remotely to reduce energy consumption in office buildings.",
      "integrating nitrogen-fixing plants into urban landscapes to reduce the need for synthetic fertilizers.",
      "reducing the reliance on fossil fuels by transitioning to electric vehicles in all urban areas."
    ],
    correctAnswer: "monitoring and optimizing electricity use through smart energy grids.",
    explanation: "The passage states that 'smart energy grids can optimize electricity use, reducing energy consumption and costs.'"
  },
  {
    question: "The author indicates that early 20th-century urban planning efforts, such as the Garden City movement, were primarily focused on:",
    options: [
      "creating large-scale industrial centers to accommodate factory workers.",
      "developing suburban neighborhoods that prioritized privacy and space.",
      "addressing the negative impacts of industrialization through the integration of green spaces.",
      "building cities that minimized the use of automobiles by promoting public transportation.",
      "expanding cities to accommodate rapid population growth following World War II."
    ],
    correctAnswer: "addressing the negative impacts of industrialization through the integration of green spaces.",
    explanation: "The passage describes the Garden City movement as 'a reaction to the negative effects of industrialization' that envisioned communities 'surrounded by green spaces' to promote 'healthier living conditions.'"
  },
  {
    question: "Which of the following most accurately characterizes the passage's discussion of the future of cities?",
    options: [
      "Cities are likely to become less important as technological advancements allow more people to live in rural areas.",
      "Cities will need to adapt to both technological innovations and environmental challenges to remain viable.",
      "The future of cities depends entirely on the successful implementation of smart city technologies.",
      "Cities will inevitably return to the design principles of the Garden City movement.",
      "The rise of remote work will lead to the abandonment of large urban centers."
    ],
    correctAnswer: "Cities will need to adapt to both technological innovations and environmental challenges to remain viable.",
    explanation: "The passage concludes by stating that 'the future of cities will likely depend on how well they can adapt to technological changes while addressing the social, environmental, and economic challenges that have always been part of urban life.'"
  },
  {
    question: "According to the passage, one of the primary differences between early agricultural societies and industrial agriculture is that:",
    options: [
      "Early societies relied on synthetic fertilizers, while industrial agriculture uses natural methods to improve soil fertility.",
      "Early societies focused on sustaining the fertility of their soil, while industrial agriculture prioritizes crop yields over long-term environmental health.",
      "Early societies were more efficient in producing high crop yields, while industrial agriculture has struggled to meet global food demands.",
      "Industrial agriculture has been more successful in maintaining soil health than early farming communities.",
      "Industrial agriculture primarily uses nitrogen-fixing plants, whereas early societies relied on monoculture."
    ],
    correctAnswer: "Early societies focused on sustaining the fertility of their soil, while industrial agriculture prioritizes crop yields over long-term environmental health.",
    explanation: "The passage states that early agricultural societies developed methods to maintain soil fertility, while industrial agriculture, despite increasing crop yields, has led to environmental issues due to the excessive use of synthetic fertilizers and pesticides."
  },
  {
    question: "The passage suggests that one potential drawback of monoculture is that it:",
    options: [
      "Reduces the efficiency of industrial agriculture by lowering crop yields.",
      "Decreases biodiversity, which can make crops more susceptible to pests and diseases.",
      "Prevents the integration of trees and other perennial plants into agricultural systems.",
      "Relies heavily on natural methods of pest control, leading to fewer options for managing pests.",
      "Increases the use of crop rotation and animal manure, which negatively impacts soil health."
    ],
    correctAnswer: "Decreases biodiversity, which can make crops more susceptible to pests and diseases.",
    explanation: "The passage states that 'the reliance on monoculture — the cultivation of a single crop over vast areas — has reduced biodiversity, making crops more vulnerable to pests and diseases.'"
  },
  {
    question: "The passage indicates that permaculture:",
    options: [
      "Is primarily practiced by large-scale farming operations due to its efficiency.",
      "Focuses on mimicking natural ecosystems to create resilient agricultural systems.",
      "Is a form of industrial agriculture that emphasizes the use of synthetic fertilizers and pesticides.",
      "Has been rejected by proponents of sustainable agriculture for its inefficiency.",
      "Promotes the use of monoculture to maximize crop yields in small-scale farms."
    ],
    correctAnswer: "Focuses on mimicking natural ecosystems to create resilient agricultural systems.",
    explanation: "The passage describes permaculture as 'a holistic approach to farming that seeks to create self-sustaining agricultural ecosystems by mimicking the diversity and resilience of natural ecosystems.'"
  },
  {
    question: "Based on the information in the passage, advocates of sustainable agriculture would most likely agree with which one of the following statements?",
    options: [
      "The environmental costs of industrial agriculture are overstated and do not justify a shift to sustainable practices.",
      "Sustainable agriculture can help create more resilient food systems and healthier ecosystems in the long term.",
      "The primary benefit of industrial agriculture is its ability to produce food with minimal environmental impact.",
      "High crop yields should always take precedence over concerns about biodiversity and soil health.",
      "Permaculture has little to offer modern farming practices because it cannot scale up to meet global food demands."
    ],
    correctAnswer: "Sustainable agriculture can help create more resilient food systems and healthier ecosystems in the long term.",
    explanation: "The passage states that proponents of sustainable agriculture argue that 'the long-term benefits of sustainable agriculture, including healthier ecosystems and more resilient food systems, outweigh any short-term reduction in yields.'"
  },
  {
    question: "The passage suggests that critics of sustainable agriculture are primarily concerned with:",
    options: [
      "The negative environmental impact of permaculture and other holistic farming practices.",
      "The long-term sustainability of industrial agriculture in meeting global food needs.",
      "The inability of sustainable farming practices to produce high enough yields to feed the world's population.",
      "The potential for sustainable agriculture to damage ecosystems through the overuse of organic fertilizers.",
      "The inefficiency of industrial agriculture compared to early agricultural methods."
    ],
    correctAnswer: "The inability of sustainable farming practices to produce high enough yields to feed the world's population.",
    explanation: "The passage states that 'Critics argue that sustainable farming practices are less efficient and cannot produce the same high yields as industrial agriculture, making them insufficient to feed the world's growing population.'"
  },
  {
    question: "The passage suggests that which one of the following is an advantage of integrated pest management (IPM)?",
    options: [
      "It minimizes the reliance on chemical pesticides while still effectively controlling pests.",
      "It significantly increases crop yields by improving soil fertility over the long term.",
      "It eliminates the need for organic fertilizers by enhancing the use of synthetic alternatives.",
      "It encourages farmers to prioritize crop rotation over monoculture to maintain biodiversity.",
      "It maximizes the use of nitrogen-fixing plants to ensure consistent soil health."
    ],
    correctAnswer: "It minimizes the reliance on chemical pesticides while still effectively controlling pests.",
    explanation: "The passage mentions integrated pest management (IPM) as a key practice in sustainable agriculture 'to control pests without relying solely on chemical pesticides.'"
  },
  {
    question: "The passage implies that one reason industrial agriculture has become the dominant model of food production globally is that:",
    options: [
      "It produces higher yields than sustainable agriculture, despite having greater environmental costs.",
      "It is more environmentally friendly than early agricultural practices, such as crop rotation and the use of animal manure.",
      "It has a stronger focus on maintaining soil health and biodiversity than sustainable agriculture.",
      "It relies on natural methods, such as permaculture, to increase crop yields in large-scale farming operations.",
      "It has proven to be more efficient than small-scale sustainable farming methods in reducing environmental degradation."
    ],
    correctAnswer: "It produces higher yields than sustainable agriculture, despite having greater environmental costs.",
    explanation: "The passage states that 'industrial agriculture has become the dominant model of food production globally, largely due to its efficiency and ability to meet the growing demands of a rapidly expanding population,' despite the environmental issues it causes."
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

function useUserProgress(userId: string | null, db: Firestore | null) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const loadUserProgress = useCallback(async (userId: string) => {
    if (!db) return;
    console.log("Loading user progress for", userId);
    try {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProgress;
        setUserProgress(data);
      } else {
        console.log("No user progress found");
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  }, [db, setUserProgress]); // Add setUserProgress to the dependency array

  useEffect(() => {
    if (userId && db) {
      loadUserProgress(userId);
    }
  }, [userId, db, loadUserProgress]);

  return { userProgress, setUserProgress, loadUserProgress };
}

const mockPassage = `The evolution of cities has always been closely tied to technological advancements. In the 19th century, the steam engine revolutionized transportation, enabling the development of railways and, in turn, the rapid growth of urban centers. Factories, once scattered across rural areas, began clustering in cities, and workers followed suit, resulting in the dense urban landscapes that characterized the Industrial Revolution. This mass migration was driven by the promise of economic opportunities, but it also brought about significant challenges, including overcrowding, poor sanitation, and the spread of disease.

In response to these challenges, urban planners and architects began developing new approaches to city design. In the early 20th century, the Garden City movement, founded by Ebenezer Howard, emerged as a reaction to the negative effects of industrialization. Howard envisioned self-contained communities surrounded by green spaces, with a balance of residential, commercial, and agricultural areas. His ideas sought to blend the best aspects of urban and rural life, promoting healthier living conditions while maintaining access to economic opportunities. Although only a few true garden cities were ever built, the movement influenced the development of suburbs and the layout of modern cities.

By the mid-20th century, the rise of the automobile further transformed urban environments. Cities expanded outward as highways and road networks were constructed, allowing people to live farther from their workplaces. The post-World War II suburban boom in the United States exemplifies this trend, as millions of people moved to newly built suburban neighborhoods, drawn by the promise of more space, privacy, and a perceived higher quality of life. However, this shift had its own drawbacks. Suburban sprawl led to increased reliance on automobiles, contributing to traffic congestion, air pollution, and a loss of open land.

In the 21st century, cities face new challenges and opportunities related to technology. The rise of the internet and digital communication has enabled more people to work remotely, raising questions about the future of urban living. Some experts argue that cities will become less central to economic activity as more people choose to live in smaller towns or rural areas while staying connected through technology. Others believe that cities will continue to thrive, as they offer cultural, social, and economic advantages that cannot be easily replicated in less densely populated areas.

At the same time, new technologies are reshaping urban infrastructure. "Smart cities," which integrate digital technology into transportation, energy, and public services, are becoming increasingly common. Proponents argue that smart cities can improve efficiency, reduce waste, and enhance the quality of life for residents. For example, sensor networks can monitor traffic in real time, helping to reduce congestion and lower emissions. Similarly, smart energy grids can optimize electricity use, reducing energy consumption and costs. However, critics raise concerns about privacy and security, as the widespread collection of data in smart cities could potentially be misused.

Ultimately, the future of cities will likely depend on how well they can adapt to technological changes while addressing the social, environmental, and economic challenges that have always been part of urban life. As cities continue to evolve, finding a balance between innovation and sustainability will be key to ensuring that urban areas remain vibrant, livable, and resilient in the face of ongoing change.

In the early stages of agricultural development, farming communities around the world faced numerous challenges that threatened the sustainability of their settlements. One of the most significant of these challenges was the depletion of soil nutrients, which could lead to a decline in crop yields and eventually force communities to abandon their land in search of more fertile areas. To address this, ancient farmers developed various methods to maintain the fertility of their soil, including crop rotation, the use of animal manure, and the introduction of nitrogen-fixing plants such as legumes. These innovations allowed early agricultural societies to sustain their food production over long periods of time.

However, the rise of industrial agriculture in the 20th century brought about a different set of challenges. While the widespread use of synthetic fertilizers and pesticides led to significant increases in crop yields, it also resulted in a range of environmental issues. The excessive use of synthetic fertilizers, for example, has led to the contamination of water supplies with nitrates, contributing to the growth of harmful algal blooms in rivers, lakes, and oceans. Additionally, the reliance on monoculture — the cultivation of a single crop over vast areas — has reduced biodiversity, making crops more vulnerable to pests and diseases. Despite these problems, industrial agriculture has become the dominant model of food production globally, largely due to its efficiency and ability to meet the growing demands of a rapidly expanding population.

In response to the environmental concerns associated with industrial agriculture, a movement known as sustainable agriculture has gained traction in recent decades. Advocates of sustainable agriculture argue that it is possible to produce food in a way that minimizes harm to the environment while still meeting the needs of human populations. Key practices in sustainable agriculture include the use of organic fertilizers, integrated pest management (IPM) to control pests without relying solely on chemical pesticides, and agroforestry, which involves the integration of trees and other perennial plants into agricultural systems to promote biodiversity and improve soil health.

One prominent example of a sustainable agriculture practice is permaculture, a holistic approach to farming that seeks to create self-sustaining agricultural ecosystems by mimicking the diversity and resilience of natural ecosystems. Permaculture emphasizes the importance of working with nature rather than against it, encouraging farmers to consider factors such as water management, soil health, and biodiversity in their decision-making processes. Though permaculture is often practiced on a small scale, its principles have inspired many larger-scale farming operations to adopt more sustainable methods.

Despite the promise of sustainable agriculture, it remains a relatively small part of global food production. Critics argue that sustainable farming practices are less efficient and cannot produce the same high yields as industrial agriculture, making them insufficient to feed the world's growing population. Proponents, however, contend that the long-term benefits of sustainable agriculture, including healthier ecosystems and more resilient food systems, outweigh any short-term reduction in yields. They also argue that many of the environmental and social costs of industrial agriculture, such as pollution and the displacement of small farmers, are not accounted for in conventional economic models.`;

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
  const { auth, db } = useFirebase()
  const { userProgress, setUserProgress, loadUserProgress } = useUserProgress(user?.uid || null, db)
  const [questionStatus, setQuestionStatus] = useState<Array<'unanswered' | 'answered' | 'unsure'>>([]);
  const [activeTab, setActiveTab] = useState("questions");

  const ensureUserDocument = useCallback(async (userId: string) => {
    if (!db) return;
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
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        if (db) {
          await ensureUserDocument(user.uid);
          await loadUserProgress(user.uid);
        }
      } else {
        setUser(null);
        setUserProgress(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db, ensureUserDocument, loadUserProgress]);

  const handleSignOut = async () => {
    if (!auth) return;
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
    setQuestionStatus(new Array(mockQuestions.length).fill('unanswered'));
  }

  const handleAnswer = async (selected: string) => {
    setSelectedAnswer(selected)
    setShowExplanation(true)
    const isCorrect = selected === mockQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
    }
    
    // Update question status
    const newStatus = [...questionStatus];
    newStatus[currentQuestion] = 'answered';
    setQuestionStatus(newStatus);

    // Update user progress
    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        totalQuestionsAnswered: increment(1),
        RReadingComprehension: isCorrect ? increment(1) : increment(0),
        ReadingComprehensionTotal: increment(1)
      });
      await loadUserProgress(user.uid);
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

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setActiveTab("questions");  // Switch to the Questions tab
  }

  const markQuestionAsUnsure = () => {
    const newStatus = [...questionStatus];
    newStatus[currentQuestion] = 'unsure';
    setQuestionStatus(newStatus);
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
    if (user && currentGeneratedQuestion && selectedTopic && db) {
      const userDocRef = doc(db, 'users', user.uid);
      const updateData: Record<string, FieldValue | Partial<unknown>> = {
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
    if (user && currentGeneratedQuestion && db) {  // Add db to this check
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
    if (user && db) {
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

  if (!auth || !db) {
    return <div>Loading...</div>
  }

  if (!user || !userProgress) {
    return <div>Please log in to view this page.</div>
  }

  console.log('Selected Topic:', selectedTopic);
  console.log('Current Generated Question:', currentGeneratedQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Gavel className="h-8 w-8 mr-2 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lawyerify Dashboard</h1>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="questions">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 pr-4 overflow-y-auto" style={{maxHeight: "80vh"}}>
                  <h3 className="text-xl font-bold mb-4">Passage</h3>
                  <p className="whitespace-pre-line">
                    {currentQuestion < 13 
                      ? mockPassage.split('\n\n').slice(0, 6).join('\n\n')  // First 6 paragraphs for urban questions
                      : mockPassage.split('\n\n').slice(6).join('\n\n')     // Last 5 paragraphs for agricultural questions
                    }
                  </p>
                </div>
                <div className="w-full md:w-1/2 pl-4">
                  <Button 
                    onClick={() => setShowTest(false)} 
                    variant="outline" 
                    className="mb-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                  </Button>
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Question {currentQuestion + 1} of {mockQuestions.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-6 text-lg font-medium">{mockQuestions[currentQuestion].question}</p>
                      <div className="space-y-3">
                        {mockQuestions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!selectedAnswer}
                            className={`w-full text-left py-3 px-4 rounded-md transition-colors duration-200 ${
                              selectedAnswer === option
                                ? option === mockQuestions[currentQuestion].correctAnswer
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                            } border`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                      {showExplanation && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                          <h4 className="font-bold mb-2 text-blue-800">Explanation:</h4>
                          <p className="text-blue-700">{mockQuestions[currentQuestion].explanation}</p>
                        </div>
                      )}
                      <div className="mt-6 flex justify-between">
                        <Button onClick={markQuestionAsUnsure} disabled={!!selectedAnswer} variant="outline">
                          Mark as Unsure
                        </Button>
                        <Button onClick={nextQuestion} disabled={!selectedAnswer}>
                          {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Test'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="overview">
              <div className="grid grid-cols-5 gap-4">
                {questionStatus.map((status, index) => (
                  <Button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    variant={status === 'answered' ? 'default' : status === 'unsure' ? 'outline' : 'secondary'}
                    className={`w-full h-12 flex items-center justify-center ${currentQuestion === index ? 'ring-2 ring-yellow-500' : ''}`}
                  >
                    <span className="mr-1">{index + 1}</span>
                    {status === 'unsure' && (
                      <Bookmark className="h-4 w-4 text-yellow-500" />
                    )}
                    {status === 'answered' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Question Type Performance</h3>
              <div className="flex flex-col md:flex-row justify-between">
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
              </div>
            </div>
            
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
