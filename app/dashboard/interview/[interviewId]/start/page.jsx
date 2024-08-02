"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../utils/db';
import { MockInterview } from "../../../../../utils/schema";
import { eq } from 'drizzle-orm';
import { Lightbulb, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import Record from "./_components/Record";
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQues, setMockInterviewQues] = useState(null);
  const [revealedQuestionIndex, setRevealedQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  }

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    try {
      console.log("Fetching interview details...");
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      console.log("Query Result:", result);
      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log("Parsed Mock Response:", jsonMockResp);
        setMockInterviewQues(jsonMockResp);
        setInterviewData(result[0]);
      } else {
        console.log("No interview found with the given ID.");
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const revealQuestion = (index) => {
    setRevealedQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (mockInterviewQues && revealedQuestionIndex < mockInterviewQues.length - 1) {
      setRevealedQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (mockInterviewQues && revealedQuestionIndex > 0) {
      setRevealedQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const finishInterview = () => {
    // Navigate to the feedback page
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Interview Questions</h1>
          {interviewData ? (
            <div>
              {mockInterviewQues ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {mockInterviewQues.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-3 bg-gray-200 rounded-full text-xs md:text-sm text-center cursor-pointer transition-transform transform hover:bg-purple-500 hover:text-white ${revealedQuestionIndex === index && 'bg-purple-500 text-white'}`}
                      onClick={() => revealQuestion(index)}
                    >
                      Question #{index + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Loading questions...</p>
              )}
              {mockInterviewQues[revealedQuestionIndex] && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {mockInterviewQues[revealedQuestionIndex]?.question}
                    <Volume2 
                      className='inline-block ml-2 text-blue-600 cursor-pointer hover:text-blue-800'
                      onClick={() => textToSpeech(mockInterviewQues[revealedQuestionIndex]?.question)}
                    />
                  </h2>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button 
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  onClick={previousQuestion}
                  disabled={revealedQuestionIndex === 0}
                >
                  <ChevronLeft className="inline-block mr-2" />
                  Previous Question
                </button>
                <button 
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  onClick={nextQuestion}
                  disabled={mockInterviewQues && revealedQuestionIndex === mockInterviewQues.length - 1}
                >
                  Next Question
                  <ChevronRight className="inline-block ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading interview details...</p>
          )}

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6'>
            <h2 className='flex gap-2 items-center text-blue-600 text-lg font-medium'>
              <Lightbulb className='text-yellow-400' />
              <strong>Note:</strong>
            </h2>
            <p className='text-blue-700 mt-2'>
              Click on "Record Answer" when you want to answer the question. At the end of the interview, we will provide feedback along with the correct answers for each question and your recorded answers for comparison.
            </p>
          </div>
        </div>
        
        <div className="flex-1">
          <Record 
            mockInterviewQues={mockInterviewQues}
            revealedQuestionIndex={revealedQuestionIndex}
            interviewData={interviewData} 
          />
        </div>
      </div>

      {/* Finish Button */}
      <div className="fixed bottom-6 right-6">
        <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
          <button 
            className="py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Finish Interview
          </button>
        </Link>
      </div>
    </div>
  );
}

export default StartInterview;
