import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "react-oauth-google";
import axios from "axios";
import userApi from "../../../../Api/userApi";

function GoogleLoginButton({ onSubmitGoogle }) {
  
  const responseGoogle = async (response) => {
    try {
      onSubmitGoogle({ credential: response.credential });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="1079208111691-644s88i1eo4tiv1ul4fct2h7cdebgjdk.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        shape="circle"
        type="icon"
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
