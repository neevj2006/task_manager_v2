import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <Button variant="contained" onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
};

export default Auth;
