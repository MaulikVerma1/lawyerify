import Link from 'next/link'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BarChart, BookOpen, CheckCircle, Gavel, Layers, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100">
      <header className="bg-black text-yellow-400 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <Gavel className="mr-2" />
            Lawerify
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-yellow-200 transition-colors">Home</Link></li>
              <li><Link href="#features" className="hover:text-yellow-200 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-yellow-200 transition-colors">Pricing</Link></li>
              <li><Link href="/signup" className="hover:text-yellow-200 transition-colors">Sign Up</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-6 leading-tight">
                  Ace the LSAT with <span className="text-yellow-500">Lawerify</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  Personalized practice, AI-powered insights, and a community of future lawyers to support your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors">
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-yellow-400 transition-colors">
                    <Link href="#features">Explore Features</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full filter blur-3xl opacity-30"></div>
                <Card className="relative bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Quick Practice</CardTitle>
                    <CardDescription>Test your skills with a sample question</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Which of the following most weakens the argument above?</p>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D', 'E'].map((option) => (
                        <Button key={option} variant="outline" className="w-full justify-start">
                          {option}. Sample answer option
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-yellow-100 to-transparent"></div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Why Choose Lawerify?</h2>
            <Tabs defaultValue="practice" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="practice">
                <Card>
                  <CardHeader>
                    <CardTitle>Extensive Question Bank</CardTitle>
                    <CardDescription>Thousands of LSAT-style questions covering all sections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FeatureItem
                      icon={<Layers className="h-5 w-5 text-yellow-500" />}
                      title="Adaptive Difficulty"
                      description="Questions that adjust to your skill level"
                    />
                    <FeatureItem
                      icon={<BookOpen className="h-5 w-5 text-yellow-500" />}
                      title="Comprehensive Explanations"
                      description="Detailed breakdowns for every question"
                    />
                    <FeatureItem
                      icon={<CheckCircle className="h-5 w-5 text-yellow-500" />}
                      title="Realistic Test Environment"
                      description="Simulate actual LSAT conditions"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>In-depth Performance Analytics</CardTitle>
                    <CardDescription>Track your progress and identify areas for improvement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FeatureItem
                      icon={<BarChart className="h-5 w-5 text-yellow-500" />}
                      title="Detailed Reports"
                      description="Visualize your performance across all LSAT sections"
                    />
                    <FeatureItem
                      icon={<Layers className="h-5 w-5 text-yellow-500" />}
                      title="Skill Breakdown"
                      description="Identify strengths and weaknesses in specific areas"
                    />
                    <FeatureItem
                      icon={<CheckCircle className="h-5 w-5 text-yellow-500" />}
                      title="Progress Tracking"
                      description="Monitor your improvement over time"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="community">
                <Card>
                  <CardHeader>
                    <CardTitle>Supportive Learning Community</CardTitle>
                    <CardDescription>Connect with fellow LSAT aspirants and experts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FeatureItem
                      icon={<Users className="h-5 w-5 text-yellow-500" />}
                      title="Discussion Forums"
                      description="Engage in topic-specific conversations"
                    />
                    <FeatureItem
                      icon={<Gavel className="h-5 w-5 text-yellow-500" />}
                      title="Expert Q&A Sessions"
                      description="Regular sessions with LSAT professionals"
                    />
                    <FeatureItem
                      icon={<CheckCircle className="h-5 w-5 text-yellow-500" />}
                      title="Study Groups"
                      description="Form or join virtual study groups"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-20 bg-yellow-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Join Thousands of Successful LSAT Takers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Lawerify's practice questions and analytics helped me improve my score by 12 points!"
                author="Sarah J., Harvard Law"
              />
              <TestimonialCard
                quote="The community support and expert Q&A sessions were invaluable in my LSAT preparation."
                author="Michael T., Stanford Law"
              />
              <TestimonialCard
                quote="I credit my 175 LSAT score to Lawerify's comprehensive study materials and adaptive learning."
                author="Emily R., Yale Law"
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-gradient-to-b from-white to-yellow-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-black mb-16">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                title="Basic" 
                price="$19.99" 
                features={["1000+ practice questions", "Basic progress tracking", "Email support"]}
              />
              <PricingCard 
                title="Pro" 
                price="$39.99" 
                features={["5000+ practice questions", "Advanced analytics", "Personalized study plans", "Priority support"]}
                highlighted={true}
              />
              <PricingCard 
                title="Premium" 
                price="$59.99" 
                features={["Unlimited questions", "AI-powered recommendations", "1-on-1 tutoring sessions", "24/7 support"]}
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-yellow-400">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Ace Your LSAT?</h2>
            <p className="text-xl mb-8">Join Lawerify today and start your journey to law school success.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 transition-colors">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors">
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-yellow-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">LSAT Tips</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Study Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-yellow-200 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-yellow-900 text-center">
            <p>&copy; 2024 Lawerify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3">
      {icon}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, author }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
        <p className="font-semibold text-right">- {author}</p>
      </CardContent>
    </Card>
  )
}

function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <div className={`p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 ${
      highlighted ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black' : 'bg-white text-black'
    }`}>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-extrabold mb-6">{price}<span className="text-xl font-normal">/month</span></p>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className={`w-5 h-5 mr-2 ${highlighted ? 'text-black' : 'text-yellow-500'}`} />
            {feature}
          </li>
        ))}
      </ul>
      <Button asChild className={`w-full py-3 text-lg font-semibold transition-colors ${
        highlighted 
          ? 'bg-black text-yellow-400 hover:bg-yellow-600 hover:text-black' 
          : 'bg-yellow-400 text-black hover:bg-yellow-500'
      }`}>
        <Link href="/signup">Choose Plan</Link>
      </Button>
    </div>
  )
}