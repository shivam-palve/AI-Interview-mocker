"use client"
import { Button } from "@/components/ui/button"
import React,{useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from "@/utils/GeminiAIModal"
import { Loader, LoaderCircle } from "lucide-react"
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs"
import moment from "moment"
import { useRouter } from "next/navigation"

function AddNewInterview() {
const [openDailog,setOpenDailog]=useState(false)
const [jobPosition,setJobPosition]=useState();
const [jobDesc,setJobDesc]=useState();
const [jobExperience,setJobExperience]=useState();
const [loading,setLoading]=useState(false);
const [jsonResponse,setJsonResponse]=useState([]);
const router=useRouter();
const {user}=useUser();
const onSubmit=async(e)=>{
  setLoading(true)
  e.preventDefault() 
console.log(jobPosition,jobDesc,jobExperience)

const InputPrompt="Job Position:"+jobPosition+",Job Description: "+jobDesc+", Yr of experience: "+ jobExperience+" depends on this information pls give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+"interview questions with answers in JSON format. give question and answered as field in JSON"

const result=await chatSession.sendMessage(InputPrompt);
const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
console.log(JSON.parse(MockJsonResp));
setJsonResponse(MockJsonResp);

if(MockJsonResp){
const resp=await db.insert(MockInterview)
.values({
mockID:uuidv4(),
jsonMockResp:MockJsonResp,
jobPosition:jobPosition,
jobDesc:jobDesc,
jobExperience:jobExperience,
createdBy:user?.primaryEmailAddress?.emailAddress,
createdAt:moment().format('DD-MM-yyyy')
}).returning({mockID:MockInterview.mockID});//change possible

console.log("Inserted ID:",resp)

if(resp)
  {
  setOpenDailog(false);
  router.push('/dashboard/interview/'+resp[0]?.mockID)
}

}
else{
console.log("ERROR");

}
setLoading(false);


}
  return (
    <div>
    <div className='p-10 border round-lg bg-secondary
    hover:scale-105 hover:shadow-md cursor-pointer 
    transition-all'
    onClick={()=>setOpenDailog(true)}
    >
<h2 className='font-bold text-lg text-center'>+ Add New</h2>
    </div>
    <Dialog open={openDailog}>
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Tell us more about your job intetview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
    <div>
  
      <h2> Add details about your job position/role,job description and Yrs of experience</h2>
     
      <div className='mt-7,my-3'>
        <label> Job Role/Job Position</label>
        <Input placeholder="Ex.Full Stack Devloper" required
        
        onChange={(event)=>setJobPosition(event.target.value)}
        />
      </div>
      <div className='mt-7,my-3'>
        <label> Job Description</label>
        <Textarea placeholder="Ex.Full Stack Devloper" required
        onChange={(event)=>setJobDesc(event.target.value)} 
        />
      </div>
      <div className='mt-7,my-3'>
        <label>Years Of Experience</label>
        <Input placeholder="EX.5" type="number" max="100"
         required
        onChange={(event)=>setJobExperience(event.target.value)}
        />
      </div>
    </div>
        <div className='flex gap-5 justify-end'>
          <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>
           {loading?
           <> 
           <LoaderCircle className='animate-spin'/>'Generating form AI'
           </>:'Start Interview'

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

export default AddNewInterview  