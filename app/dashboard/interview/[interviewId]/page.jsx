"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam'; // Import the Webcam component
import { db } from '../../../../utils/db';
import { MockInterview } from "../../../../utils/schema";
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '../../_components/button';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInterviewDetails();
    console.log(params.interviewId);
  }, [params.interviewId]);

  /**
   * Fetch interview details by mock ID
   */
  const getInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      console.log(result);
      setInterviewData(result[0]);
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  const handleUserMedia = async () => {
    try {
      // Request both webcam and microphone access
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamEnabled(true);
      setMicrophoneEnabled(true);
      setError(null);
    } catch (err) {
      setWebcamEnabled(false);
      setMicrophoneEnabled(false);
      setError('Webcam or microphone access denied or not available');
      console.error('Media access error:', err);
    }
  };

  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDescription}</h2>
            <h2 className='text-lg'><strong>Job Experience:</strong> {interviewData?.jobExpirence}</h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-3 items-center'><Lightbulb /><strong>Information</strong></h2>
            <h2 className='mt-3'>
              Enable Video Webcam and Microphone to start your AI-generated mock interview. It has 5 questions which you can answer, and at the last, you will get the report
              based on your answers. NOTE: We never record your video; webcam access can be disabled at any time if you want.
            </h2>
          </div>
        </div>
        <div>
          {webcamEnabled && microphoneEnabled ? (
            <Webcam
              mirrored={true} // Mirrored property
              style={{
                height: 240,
                width: 320,
                padding: 20,
                border: '1px solid black',
                borderRadius: '8px'
              }}
            />
          ) : (
            <>
              <WebcamIcon className='h-72 w-full p-20 my-7 bg-secondary rounded-lg border' />
              {error && <p className="text-red-500">{error}</p>}
              <Button onClick={handleUserMedia} variant="ghost" className='w-full'>
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='flex justify-end items-end'>
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
