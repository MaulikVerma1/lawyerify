'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useFirebase } from '../../hooks/useFirebase'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

// Add this interface near the top of the file, after the imports
interface BookmarkedQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
}

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([])
  const router = useRouter()
  const { auth, db } = useFirebase()

  const loadBookmarkedQuestions = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const data = userDoc.data()
      setBookmarkedQuestions(data.bookmarkedQuestions || [])
    }
  }, [db])

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
          loadBookmarkedQuestions(currentUser.uid)
        } else {
          router.push('/login')
        }
      })

      return () => unsubscribe()
    }
<<<<<<< Updated upstream
  }, [auth, router, db])

  const loadBookmarkedQuestions = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const data = userDoc.data()
      setBookmarkedQuestions(data.bookmarkedQuestions || [])
    }
  }
=======
  }, [auth, router, loadBookmarkedQuestions])
>>>>>>> Stashed changes

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bookmarked Questions</h1>
        {bookmarkedQuestions.map((question, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>{question.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{question.question}</p>
              <p className="font-bold">Correct Answer: {question.correctAnswer}</p>
              <p className="mt-2">{question.explanation}</p>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => router.push('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
