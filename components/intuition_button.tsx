import Image from "next/image";

const IntuitionButton = ({ text = "Powered by", logoText = "INTUITION" }) => {
  return (
    <button
      className="
        inline-flex items-center 
        py-2.5 px-5 
        bg-[#1a2a3a] 
        text-slate-400 
        font-semibold text-base font-sans 
        rounded-full 
        shadow-md 
        cursor-pointer 
        transition-colors duration-300 ease-in-out 
        hover:bg-[#2c4257]
      ">
      <span>{text}</span>
      <span
        className="
            relative
          flex items-center justify-center 
          w-6 h-6 
          mx-2.5 
          border-2 border-slate-400 
          rounded-full
        ">
        <Image src="/logo.png" alt="logo" fill className="object-cover w-full h-full" />
      </span>
      <span>{logoText}</span>
    </button>
  );
};

export default IntuitionButton;
