"use client";

import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
   // * This isMounted ensuring none of modal can be seen are opened during server side rendering

   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) return null;

   return (
      <>
         <Modal title="test mode" description="test des" isOpen onChange={() => {}}>
            Child
         </Modal>
      </>
   );
};

export default ModalProvider;
