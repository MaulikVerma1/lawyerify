'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { useFirebase } from '../../hooks/useFirebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { auth, signInWithGoogle } = useFirebase()

  useEffect(() => {
    console.log('Login page: Auth object:', auth)
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Login page: Auth state changed, user:', user)
        if (user) {
          console.log('Login page: User is authenticated, redirecting to dashboard')
          router.push('/dashboard')
        }
      })

      return () => unsubscribe()
    }
  }, [auth, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    console.log('Login page: Attempting to log in')

    if (!auth) {
      console.error('Login page: Auth object is not available')
      setError('Authentication service is not available. Please try again later.')
      return
    }

    try {
      console.log('Login page: Before Firebase auth call')
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Login page: User logged in successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login page: Error logging in:', error)
      setError('Failed to log in. Please check your email and password.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center text-black">
          <span className="text-2xl font-bold">Lawerify</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-yellow-600 hover:text-yellow-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-yellow-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
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
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-2 rounded-md transition duration-200">
                Log in
              </Button>
            </form>
            <div className="mt-4">
              <Button 
                onClick={handleGoogleSignIn} 
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">w
              Forgot your password?{' '}
              <Link href="/reset-password" className="font-medium text-yellow-600 hover:text-yellow-500 transition duration-200">
                Reset it here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
