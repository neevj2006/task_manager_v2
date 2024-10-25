// React component for Google authentication
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      // Firebase's popup-based authentication
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // Implements error handling for failed sign-in attempts
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <Button variant="contained" onClick={signInWithGoogle} color="primary">
        Sign in with Google
      </Button>
    </div>
  );
};

export default Auth;
