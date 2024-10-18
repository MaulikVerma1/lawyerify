'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebase } from '../../hooks/useFirebase'
import { doc, updateDoc } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Check } from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()
  const { db, auth } = useFirebase()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const user = auth?.currentUser

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      alert('Please sign in to upgrade your account.')
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        isPremium: true,
        premiumPlan: plan,
        premiumSince: new Date().toISOString()
      })
      alert(`Upgrade to ${plan} plan successful!`)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error upgrading account:', error)
      alert('Error upgrading account. Please try again.')
    }
  }

  const plans = [
    { name: "Basic", price: "$9.99", period: "month", features: ["5 practice tests", "Basic analytics"] },
    { name: "Pro", price: "$19.99", period: "month", features: ["Unlimited practice tests", "Advanced analytics", "Personalized study plans"] },
    { name: "Premium", price: "$29.99", period: "month", features: ["All Pro features", "1-on-1 tutoring", "Guaranteed score improvement"] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="mb-8 bg-white hover:bg-yellow-50 text-black">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold mb-4 text-center text-black">Upgrade Your Account</h1>
        <p className="text-xl text-center mb-12 text-gray-700">Choose the plan that best fits your needs</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[600px] flex flex-col justify-between ${
                selectedPlan === plan.name ? 'ring-4 ring-yellow-400' : ''
              } ${
                plan.name === 'Pro' ? 'bg-yellow-300' : ''
              }`}
            >
              <CardHeader className={`p-6 ${plan.name === 'Pro' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400'}`}>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <p className="text-4xl font-bold mb-2 text-black">{plan.price}<span className="text-lg font-normal text-gray-600">/{plan.period}</span></p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 mr-2 text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className={`p-6 ${plan.name === 'Pro' ? 'bg-yellow-400' : 'bg-gray-50'}`}>
                <Button 
                  className={`w-full ${plan.name === 'Pro' ? 'bg-black text-yellow-400' : 'bg-black text-white'} hover:bg-yellow-500 hover:text-black transition-colors duration-300`}
                  onClick={() => {
                    setSelectedPlan(plan.name)
                    handleUpgrade(plan.name)
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Select {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
