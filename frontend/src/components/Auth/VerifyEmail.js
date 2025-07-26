//This file provides the interface for email verification

import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/auth/verify-email/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center relative top-80 bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
        <h2 className="text-3xl font-semibold text-yellow-400 mb-4">
          Email Verification
        </h2>
         <p className="text-gray-300 text-lg">Verification Successful!<br/>PLease Login</p>. {/*If you want you cam print message here */}
      </div>
    </div>
  );
};

export default VerifyEmail;
