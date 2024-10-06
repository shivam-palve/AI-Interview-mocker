//  import { Button } from "@/components/ui/button";
//  import Image from "next/image";

//  export default function Home() {
//    return (
//      <div>
//        <h2>Shivam Palve!</h2>
//        <Button>Dashboard</Button>
//      </div>
   
//    );
//  }

"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push("/dashboard"); 
  };

  return (
    <div>
      <h2>Welcome User!</h2>
      <Button onClick={navigateToDashboard}>Dashboard</Button>
    </div>
  );
}
