'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useFirebase } from '../../hooks/useFirebase'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { CheckCircle } from 'lucide-react'

interface Plan {
  title: string;
  price: string;
  features: string[];
}

export default function PaymentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const router = useRouter()
  const { auth } = useFirebase()

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
        } else {
          router.push('/login')
        }
      })
      return () => unsubscribe()
    }
  }, [auth, router])

  useEffect(() => {
    const plan = localStorage.getItem('selectedPlan')
    if (plan) {
      setSelectedPlan(JSON.parse(plan))
    }
  }, [])

  if (!user || !selectedPlan) {
    return <div>Loading...</div>
  }

  const handlePayment = () => {
    // Implement payment logic here
    console.log('Processing payment for', selectedPlan.title)
    // After successful payment, you might want to update the user's subscription status
    // and redirect them to a confirmation page or dashboard
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Selected Plan: {selectedPlan.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Price: {selectedPlan.price}/month</p>
          <ul className="mb-6">
            {selectedPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Button onClick={handlePayment} className="w-full">Proceed to Payment</Button>
        </CardContent>
      </Card>
    </div>
  )
}
