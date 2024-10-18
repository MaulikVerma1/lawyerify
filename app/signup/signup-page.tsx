'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Gavel } from 'lucide-react'
import { useFirebase } from '@/hooks/useFirebase'
import Image from 'next/image'



export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { auth, signInWithGoogle } = useFirebase()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Signup page: Auth state changed, user:', user)
      if (user) {
        console.log('Signup page: User is authenticated, redirecting to dashboard')
        router.push('/dashboard')
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    console.log('Attempting to sign up/log in') // Add this line

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    if (!auth) return

    try {
      console.log('Before Firebase auth call')
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('After Firebase auth call, user signed up successfully')
      // The useEffect hook will handle the redirection
    } catch (error) {
      console.error('Error signing up:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The useEffect hook will handle the redirection
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center text-black">
          <Gavel className="h-8 w-8 mr-2" />
          <span className="text-3xl font-bold">Lawerify</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4 text-center font-semibold">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="new-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  name="confirm-password" 
                  type="password" 
                  autoComplete="new-password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="border-2 border-yellow-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-yellow-600 hover:text-yellow-500 font-medium">Terms and Conditions</a>
                </label>
              </div>

              <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                Sign up
              </Button>
            </form>
            <div className="mt-4">
              <Button 
                onClick={handleGoogleSignIn} 
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center"
              >
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-xs text-gray-600 w-full">
              By signing up, you agree to our{' '}
              <Link href="/privacy" className="font-medium text-yellow-600 hover:text-yellow-500">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
