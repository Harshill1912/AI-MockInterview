"use client";
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { Button } from './button';

function List() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const router = useRouter();  // Use router for navigation

  const getInterviewList = async () => {
    if (!user) return;

    try {
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.id));

      console.log(result);
      setInterviewList(result);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  useEffect(() => {
    getInterviewList();
  }, [user]);

  const handleFeedback = (interviewId) => {
    // Navigate to the feedback page for the selected interview
    router.push(`/dashboard/interview/${interviewId}/feedback`);
  };

  const handleStart = (interviewId) => {
    // Navigate to the start page for the selected interview
    router.push(`/dashboard/interview/${interviewId}/start`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Previous Mock Interviews</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        {interviewList.length > 0 ? (
          <ul className="space-y-4">
            {interviewList.map((interview) => (
              <li key={interview.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
               <h2 className='font-bold text-purple-900 text-xl'>{interview?.jobPosition}</h2>
               <h2 className='text-sm text-gray-500'> <strong>Job Expirence: </strong>{interview?.jobExpirence}</h2>
               <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt}</h2>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleFeedback(interview.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Feedback
                  </Button>
                  <Button
                    onClick={() => handleStart(interview.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Start
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No previous mock interviews found.</p>
        )}
      </div>
    </div>
  );
}

export default List;
