// src/app/page.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const renderMath = (text: string) => {
  try {
    // First split the text into steps (assuming steps are separated by line breaks)
    const steps = text.split('\n\n').filter(step => step.trim() !== '')

    // Process each step
    const processedSteps = steps.map(step => {
      // Replace math blocks with KaTeX rendered HTML
      let processedStep = step.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
        return `<div class="math-block">${katex.renderToString(tex, { displayMode: true, throwOnError: false })}</div>`
      })

      // Replace inline math expressions
      processedStep = processedStep.replace(/\$(.*?)\$/g, (_, tex) => {
        return katex.renderToString(tex, { displayMode: false, throwOnError: false })
      })

      // Add appropriate styling based on content
      if (processedStep.toLowerCase().startsWith('step')) {
        return `<div class="solution-step"><div class="step-content">${processedStep}</div></div>`
      } else if (
        processedStep.toLowerCase().includes('final answer') || 
        processedStep.toLowerCase().includes('therefore') ||
        processedStep.toLowerCase().includes('boxed')
      ) {
        return `<div class="final-answer">${processedStep}</div>`
      } else {
        return `<div class="solution-text">${processedStep}</div>`
      }
    })

    return processedSteps.join('')
  } catch (error) {
    console.error('Math rendering error:', error)
    return text
  }
}

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const base64String = await convertToBase64(file)
          setSelectedImage(base64String)
          setInputValue('')
        } catch (error) {
          console.error('Error converting image:', error)
          alert('Error processing image')
        }
      } else {
        alert('Please select an image file')
      }
    }
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const base64String = await convertToBase64(file)
          setSelectedImage(base64String)
          setInputValue('')
        } catch (error) {
          console.error('Error converting image:', error)
          alert('Error processing image')
        }
      } else {
        alert('Please drop an image file')
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setSelectedImage(null)
  }

  const handleSolve = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      const payload: {
        text?: string
        imageUrl?: string
      } = {}

      if (selectedImage) {
        payload.text = inputValue || `Analyze this math problem step by step:

Step 1: Problem Identification
$$\text{Given equation or expression to solve}$$

Step 2: Solution Strategy
First, let's understand what we need to do to solve this problem.
(Explain the approach using inline math notation where needed, like $\text{variables}$ or $\text{terms}$)

Step 3: Step-by-Step Solution
Let's solve this systematically:

Starting with our equation:
$$\text{Initial equation}$$

First step:
$$\text{Show manipulation with proper formatting}$$

Continue solving:
$$\text{Show each step clearly}$$

Next:
$$\text{Use proper mathematical notation for each step}$$

Step 4: Final Calculation
$$\text{Show the final algebraic step}$$

Step 5: Verification (if applicable)
Let's verify our answer by substituting back:
$$\text{Show the verification step}$$

Therefore:
$$\boxed{\text{Final Answer}}$$

Format ALL mathematical expressions using proper notation:
- Every equation in display math mode ($$...$$)
- Fractions: \frac{numerator}{denominator}
- Square roots: \sqrt{x}
- Powers: x^2, x^n
- Greek letters: \pi, \theta
- Trigonometric: \sin, \cos, \tan
- Special functions: \lim, \sum, \int
- Multiplication: \times or \cdot
- Division: \div or \frac{}{}
- Relations: \leq, \geq, \neq
- Sets: \in, \subset
- Logic: \implies, \iff
- Show each step clearly with proper mathematical notation`

        payload.imageUrl = selectedImage
      } else if (inputValue) {
        payload.text = inputValue
      }

      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process request')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error:', error)
      setResult(error instanceof Error ? error.message : 'An error occurred while processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fallai Solver</h1>
            <p className="mt-2 text-gray-600">Type or upload an image of a math problem</p>
          </div>

          {/* Universal Input Box */}
          <div 
            className={`relative border-2 border-dashed rounded-lg transition-colors ${
              selectedImage 
                ? 'border-gray-300' 
                : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedImage ? (
              // Image Preview
              <div className="relative h-64 w-full">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              // Text Input
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                className="w-full h-32 p-4 rounded-lg focus:outline-none resize-none"
                placeholder="Type your math problem or drop an image here..."
              />
            )}

            {/* Upload Button */}
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Upload image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M20.4 14.5L16 10 4 20"/>
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Solve Button */}
          <button
            onClick={handleSolve}
            disabled={isLoading || (!inputValue && !selectedImage)}
            className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
              isLoading || (!inputValue && !selectedImage)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Solve'
            )}
          </button>


          {/* Result Area */}
          {result && (
            <div className="mt-6 result-container">
              <div className="result-header">
                <h2 className="text-xl font-semibold text-gray-900">Step-by-Step Solution</h2>
              </div>
              <div 
                className="prose p-4"
                dangerouslySetInnerHTML={{ __html: renderMath(result) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}