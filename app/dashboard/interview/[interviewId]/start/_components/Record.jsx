import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '../../../../../dashboard/_components/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../_components/GeminiAiModal';
import { db } from '../../../../../../utils/db';
import { userAnswer } from '../../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function Record({ mockInterviewQues, revealedQuestionIndex, interviewData }) {
  const [userAnswerText, setUserAnswerText] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  const {
    error = null,
    isRecording = false,
    results = [],
    setResults,
    startSpeechToText = () => {},
    stopSpeechToText = () => {},
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  const startStopRecording = async () => {
    try {
      if (isRecording) {
        stopSpeechToText();
        if (userAnswerText.trim().length <= 0) {
          setLoading(false);
          console.log('Error: User answer is empty.');
          toast.error('Error while saving your answer. Please record your answer.');
          return;
        }
        console.log('Recording stopped. User answer:', userAnswerText);
        toast.success('Feedback received successfully.');
      } else {
        console.log('Starting recording...');
        startSpeechToText();
      }
    } catch (err) {
      console.error('Error during speech-to-text processing:', err);
      toast.error('An error occurred while processing your request.');
    }
  };

  const UpdateUserAns = async () => {
    try {
      setLoading(true);
      if (!interviewData || !interviewData.mockId) {
        console.error('Error: interviewData or mockId is missing.', interviewData);
        setErrorMessage('Error: interview data is incomplete. Please check the interview data.');
        toast.error('Error: interview data is incomplete.');
        return;
      }

      const questionData = mockInterviewQues[revealedQuestionIndex];
      if (!questionData || !questionData.question || !questionData.answer) {
        console.error('Error: Question data is incomplete.', questionData);
        setErrorMessage('Error: Question data is incomplete. Please check the question data.');
        toast.error('Error: Question data is incomplete.');
        return;
      }

      const feedbackPrompt = `Question: ${questionData.question}. User Answer: ${userAnswerText}. Based on the question and user answer, please provide a rating and feedback for the answer in JSON format with 'rating' and 'feedback' fields.`;

      console.log('Sending prompt to chatSession:', feedbackPrompt);
      const result = await chatSession.sendMessage(feedbackPrompt);

      if (!result || !result.response) {
        console.error('No response received from chatSession.');
        setErrorMessage('No response received from the server.');
        toast.error('No response received from the server.');
        return;
      }

      const responseText = await result.response.text();
      console.log('Received response from chatSession:', responseText);

      const cleanedResponseText = responseText.replace('```json', '').replace('```', '').trim();
      console.log('Cleaned JSON response:', cleanedResponseText);

      let feedbackResponse;
      try {
        feedbackResponse = JSON.parse(cleanedResponseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        setErrorMessage('Error parsing JSON response. Please check the response format.');
        toast.error('Error parsing JSON response. Please check the response format.');
        return;
      }

      if (!feedbackResponse.feedback || !feedbackResponse.rating) {
        console.error('Incomplete response:', feedbackResponse);
        setErrorMessage('Incomplete response from the server. Please ensure the response includes both rating and feedback.');
        toast.error('Incomplete response from the server. Please ensure the response includes both rating and feedback.');
        return;
      }

      console.log('Data to be inserted:', {
        mockIdRef: interviewData.mockId,
        question: questionData.question,
        correctAnswer: questionData.answer,
        userAnswer: userAnswerText,
        feedback: feedbackResponse.feedback,
        rating: feedbackResponse.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });

      await db.insert(userAnswer).values({
        mockIdRef: interviewData.mockId,
        question: questionData.question,
        correctAnswer: questionData.answer,
        userAnswer: userAnswerText,
        feedback: feedbackResponse.feedback,
        rating: feedbackResponse.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });

      toast.success('User answer saved successfully.');
    } catch (err) {
      console.error('Error updating user answer:', err);
      setErrorMessage('An error occurred while saving your answer.');
      toast.error('An error occurred while saving your answer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results) {
      const newAnswer = results.map(result => result.transcript).join(' ');
      console.log('Speech-to-text results:', newAnswer);
      setUserAnswerText(prevAns => prevAns + newAnswer);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswerText.trim().length > 10) {
      console.log('User answer length is sufficient, updating answer.');
      UpdateUserAns();
    }
  }, [userAnswerText]);

  return (
    <div className='flex flex-col items-center mt-10'>
      <div className='relative flex flex-col justify-center bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto'>
        <Image
          src={'/webCam.svg'}
          height={300}
          width={300}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          alt="Background"
        />
        {webcamEnabled && (
          <Webcam
            mirrored={true}
            style={{
              height: 300,
              width: 300,
              zIndex: 10,
              borderRadius: '8px'
            }}
          />
        )}
      </div>
      <div className='mt-10 flex flex-col items-center'>
        <Button variant='outline' className="mb-4 py-2 px-6 rounded-lg text-lg font-semibold transition-colors duration-300" onClick={startStopRecording} disabled={loading}>
          {isRecording
            ? <h2 className="text-red-600 flex gap-2 items-center"><StopCircle /> Stop Recording...</h2>
            : <h2 className="text-purple-700 flex gap-2 items-center"><Mic /> Record Answer</h2>
          }
        </Button>
        <Button onClick={() => setWebcamEnabled(!webcamEnabled)} className="mb-4 py-2 px-6 rounded-lg text-lg font-semibold transition-colors duration-300">
          {webcamEnabled ? 'Disable Webcam' : 'Enable Webcam'}
        </Button>
        <Button onClick={() => console.log('User Answer:', userAnswerText)} className="py-2 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
          Show User Answer
        </Button>
        {errorMessage && <div className='text-red-600 mt-4'>{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Record;
