"use client"
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { Result } from 'postcss'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { UserAnswer } from '@/utils/schema'
import moment from 'moment/moment'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
 
function RecordAnsSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
const [userAnswer,setuserAnswer]=useState('');
const {user}=useUser();
const [loading,setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults

  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
results.map((result)=>(
  setuserAnswer(prevAns=>prevAns+result?.transcript)
))
  },[results])

  useEffect(()=>{
if(!isRecording&&userAnswer.length>10)
{
UpdateUserAnswer();
}
  },[userAnswer] )

   const StartStopRecording=async()=>{
     if(isRecording)
     {  
       stopSpeechToText()   
 }
else
  {
     startSpeechToText();
   }
   }

const UpdateUserAnswer=async()=>{
  setLoading(true);
  const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
  ",User Answer:"+userAnswer+",Depends on question and user answer for give interview question"+
  "Please give us rating for answer and feedback as area of improvement if any"+
  "in just 3 to 5 lines to improve it in JSON format with rating field and  feedback field";
  
  const result =await chatSession.sendMessage(feedbackPrompt);
  
  const mockJsonResp=(result.response.text()).replace('```json','').replace('```','')
 
  console.log(mockJsonResp);
  const JsonFeedbackResp=JSON.parse(mockJsonResp);
  const resp=await db.insert(UserAnswer)
  .values({
 
 mockIDRef:interviewData?.mockID,
 question:mockInterviewQuestion[activeQuestionIndex]?.question,
 correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
 userAns:userAnswer,
 feedback:JsonFeedbackResp?.feedback,
 rating:JsonFeedbackResp?.rating,
 userEmail:user?.primaryEmailAddress?.emailAddress,
 createdAt:moment().format('DD-MM-YYYY')
  })
 
  if(resp){
   toast('user answer recorded successfully');
   setuserAnswer('');
   setResults([]); 
  }
  setResults([]); 

  setLoading(false);

}
  return (
<div className='flex items-center justify-center flex-col'>
    <div className='flex flex-col mt-20 justify-center bg-black items-center  rounded-lg p-5'>
    <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>
      <Webcam
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
    </div>
    <Button 
    disabled={loading}
    variant="outline" className="my-10"
    
    onClick={StartStopRecording}
       >
     {isRecording?
     <h2 className='text-red-600 flex gap-2'>
      <Mic/>Stop Recording
     </h2>
     :
    
      'Record Answer'}</Button>
 
    </div>
  )
}

export default RecordAnsSection