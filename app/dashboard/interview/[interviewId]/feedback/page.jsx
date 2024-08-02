"use client";
import React, { useEffect, useState } from 'react';
import { userAnswer } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../utils/db';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../../../_components/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
 const router=useRouter();
  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const result = await db.select()
        .from(userAnswer)
        .where(eq(userAnswer.mockIdRef, params.interviewId))
        .orderBy(userAnswer.id);

      console.log(result);
      setFeedbackList(result);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  return (
    <div className='p-10'>
      <h2 className='text-3xl text-green-500 font-bold'>Congratulations!!!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      <h2 className='text-purple-500 text-lg my-3'>
        Your overall interview rating: <strong>7/10</strong>
      </h2>
      <h2 className='text-sm text-gray-500'>
        Find below interview questions with correct answers, your answer, and feedback for improvement
      </h2>
      {feedbackList && feedbackList.length > 0 ? (
        feedbackList.map((item, index) => (
          <Collapsible key={index} className='mt-5'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
              {item.question}
              <ChevronsUpDown className='h-5 w-5' />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 rounded-lg border p-2'>
                  <strong>Rating:</strong> {item.rating}
                </h2>
                 <h2 className='p-2 border rounded bg-red-50 text-sm text-red-900'><strong>Your Answer</strong>{item.userAnswer}</h2>
                 <h2 className='p-2 border rounded bg-green-50 text-sm text-green-900'><strong>Correct Answer</strong>{item.correctAnswer}</h2>
                 <h2 className='p-2 border rounded bg-blue-50 text-sm text-blue-900'><strong>FeedBack</strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p>No feedback available.</p>
      )}
    
      <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  );
}

export default Feedback;
