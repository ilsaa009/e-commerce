"use client";
import { useRouter } from 'next/navigation'; 

const BackButton = () => {
  const router = useRouter(); 

  return (
    <button
      onClick={() => router.back()} 
      className="back-button bg-gray-300 px-4 py-2 rounded-md mb-4"
    >
      Back
    </button>
  );
};

export default BackButton;
