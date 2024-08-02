"use client"
import React, { useState } from 'react';
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Input } from './input';
import { chatSession } from './GeminiAiModal';
import { Textarea
} from './textarea';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '../../../utils/schema';
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import{db} from '../../../utils/db'
import { useRouter } from 'next/navigation';




const count=5;
  function AddNewinterview() {
    const[openDialog,setOpenDialog]=useState(false)
    const[jobPosition,setjobPosition]=useState();
    const[jobDesc,setjobDesc]=useState();
    const[jobExp,setjobExp]=useState();
    const[loading,setLoading]=useState(false);
    const[jsonResponse,setjsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();
    const onSubmit=async(e)=>{
      setLoading(true);
      e.preventDefault();
  console.log(jobExp,jobDesc,jobPosition)

  const InputPrompt="Job Position "+jobPosition+",Job Description: "+jobDesc+",Years of Expirence:"+jobExp+" ,Depend on Job Postion ,Job Description & Years of Expirence give us "+count+" interview question along with Answer in Json format.Give us question and answer filed as Json "
const result=await chatSession.sendMessage(InputPrompt)
const MockJsonResponse=(result.response.text()).replace('```json','').replace('```','');

setjsonResponse(MockJsonResponse);
if(MockJsonResponse){
const resp=await db.insert(MockInterview).values({
  mockId:uuidv4(),
  jsonMockResp:MockJsonResponse,
  jobPosition:jobPosition,
  jobDescription:jobDesc,
 jobExpirence:jobExp,
  createdBy:user?.primaryEmailAddress?.emailAddress,
  createdAt:moment().format('DD-MM-YY')
  
}).returning({mockId:MockInterview.mockId})
console.log("Inserted ID :",resp)
if(resp){
  setOpenDialog(false)
  router.push('/dashboard/interview/'+resp[0]?.mockId)
}
}
else{
  console.log("error")
}
setLoading(false);
}
    
  return (
    <div>
<div className='p-10 border rounded-lg hover:scale-105 bg-gray-100 hover:shadow-md cursor-pointer transition-all'
 onClick={()=>setOpenDialog(true)}>
    <h2 className='text-lg text-center'> +  Add New</h2>
</div>
<Dialog open={openDialog}>
  <DialogTrigger></DialogTrigger>
  <DialogContent className='max-w-xl'>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
      <DialogDescription>
     <form>
       
      <div onSubmit={onSubmit}>
        
        <h2>Add Details about your jon position/role, job description and years of expirence</h2>
        <div className='mt-7 my-5'>
          <label >Job Role/Job Position</label>
          <Input placeholder="Ex. Full Stack Devloper" className='mt-2' required onChange={(event)=>setjobPosition(event.target.value)}></Input>
        </div>
        <div className=' my-5'>
          <label >Job Description/ Tech Stack (In Short)</label>
          <Textarea placeholder="Ex. React, Angular, NodeJs, MySql" className='flex mt-4 w-500xl border-gray-500' required onChange={(event)=>setjobDesc(event.target.value)}></Textarea>
        </div>
        <div className=' my-5'>
          <label >Years of expirence</label>
     <Input placeholder="5" type="number" max="30" onChange={(event)=>setjobExp(event.target.value)}></Input>
        </div>

      </div>
    

        <div  className='flex gap-3 justify-end mt-3'>
        <Button  type="button "variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
        <Button type="button" disabled={loading} onClick={onSubmit} >
        {loading?
      <>
      <LoaderCircle className='animate-spin'/> Generating from AI
      </> :"Start Interview" 
      }
        
      </Button>
        </div>
        </form>
      </DialogDescription>
    
    </DialogHeader>
  </DialogContent>
</Dialog>


    </div>
  
  )
}

export default AddNewinterview