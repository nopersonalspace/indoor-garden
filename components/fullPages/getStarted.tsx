//Next imports
import Head from "next/head";
import { useRouter } from "next/router";

//Firebase imports
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useUserAuth } from "../../contexts/AuthContext";
import { db } from "../../utils/firebaseUtils";
import { addPlant } from "../../data/firestore";

//UI  Imports
import { Flex, Button, useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { SignInButton, SignUpButton } from "../layout";

//React import
import { useEffect, useState } from "react";



//Setup constants
const auth = getAuth();
const provider = new GoogleAuthProvider();


//Default export
export default function GetStarted() {

  //Hooks
  const router = useRouter();
  const { success } = router.query;
  const toast = useToast();
  const { user, setName, name } = useUserAuth();
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  //EFFECTS
    //If URL "success" paramater is equal to "password-reset-email-sent"
    //show success toast message
  useEffect(() => {
    if (success == "password-reset-email-sent") {
      toast({
        title: "Success",
        position: "top",
        description: "Check your email for a password reset link",
        status: "success",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
        containerStyle: {
          width: "95vw",
          maxWidth: "900px",
        },
      });
    }
  }, [success]);

  //HANDLERS
    //When user clicks "Sign in with Google" button
    //log in with Google flow
  const handleGoogleClick = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const googleUser = result.user;

        // ...
      })
      .then(async () => {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          authProvider: "Google",
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          timeCreated: serverTimestamp(),
        });
        setName(name);
        addPlant(
          {
            icon: "🌱",
            commonName: "Welcome Plant",
            nickname: "Hi!",
            timeTillNextWater: 0,
            wateringStreak: 0,
            level: 1,
            timeCreated: serverTimestamp(),
            timeLastWatered: serverTimestamp(),
          },
          user.uid
        );
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex flex-col items-stretch h-screen">
      <Head>
        <title>Indoor Garden 🌱</title>
      </Head>
      <div className="h-[80%]">
        <h1 className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-4xl text-sun-100">
          Indoor Garden
        </h1>
      </div>
      {/* TODO: make it so that this bottom part is attached to bottom isntead of being below the block above. */}
      <div className="flex flex-col items-center justify-center h-[50%]">
        <Flex
          direction="column"
          gap="32px"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
        >
          <SignUpButton
            showLoadingSpinner={showLoadingSpinner}
            setShowLoadingSpinner={setShowLoadingSpinner}
          ></SignUpButton>
          <Button
            onClick={handleGoogleClick}
            leftIcon={<FcGoogle />}
            size="sm"
            className="text-sm"
          >
            Sign in with google
          </Button>
          <SignInButton
            showLoadingSpinner={showLoadingSpinner}
            setShowLoadingSpinner={setShowLoadingSpinner}
          ></SignInButton>
        </Flex>
      </div>
    </div>
  );
}
