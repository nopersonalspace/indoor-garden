import Image from "next/image";
import // getUserNameFromFirebase,
"../data/firestore";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import { useUserAuth } from "../contexts/AuthContext";
import { db } from "../utils/firebaseUtils";

//called for sendEmailVerification
const auth = getAuth();

export const SignUpButton = ({ showLoadingSpinner, setShowLoadingSpinner }) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { signUp, user } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password)
        .then(async () => {
          await sendEmailVerification(auth.currentUser);
        })
        .then(async () => {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            uid: auth.currentUser.uid,
            authProvider: "Username and Password",
            email,
            name: name,
            timeCreated: serverTimestamp(),
          });
        })
        .then(() => {
          setShowLoadingSpinner(true);
          setTimeout(() => {
            setShowLoadingSpinner(false);
            onClose();
          }, 1000);
        });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(`Email already in use`);
      } else {
        setError(err.code);
      }
    }
  };

  return (
    <div>
      <Button
        id="exchange-button"
        className="bg-white drop-shadow-sm rounded-full text-grey-600 px-4 py-2 text-center font-[558] transition-all"
        borderRadius="999px"
        leftIcon={<p>🌱</p>}
        onClick={onOpen}
      >
        Create Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            onClick={() => {
              setError("");
            }}
          />
          <ModalHeader>Create Account</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm">
                    Name
                  </label>
                  <input
                    required
                    id="name"
                    name="name"
                    type="text"
                    className="bg-grey-100 rounded-md border-2 border-grey-300 px-4 py-2 text-sm"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    className="bg-grey-100 rounded-md border-2 border-grey-300 px-4 py-2 text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    className="bg-grey-100 rounded-md border-2 border-grey-300 px-4 py-2 text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <Alert status="error" borderRadius="xl">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex gap-1">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={showLoadingSpinner}
              >
                Create Account
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export const SignInButton = ({ showLoadingSpinner, setShowLoadingSpinner }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password).then(() => {
        setShowLoadingSpinner(true);
        setTimeout(() => {
          setShowLoadingSpinner(false);
          onClose();
        }, 400);
      });
    } catch (err) {
      // setError(err.message);
      if (err.code === "auth/wrong-password") {
        setError("Wrong password friend");
      } else if (err.code === "auth/user-not-found") {
        setError(`Email doesn't exist`);
      } else {
        setError(err.code);
      }
    }
  };



  return (
    <div className="flex flex-row gap-4">
      <Button
        id="exchange-button"
        className="bg-white drop-shadow-sm rounded-full text-grey-600 px-4 py-2 text-center font-[558] transition-all"
        borderRadius="999px"
        leftIcon={<p>☀️</p>}
        onClick={onOpen}
      >
        Sign In
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Sign In</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="bg-grey-100 rounded-md border-2 border-grey-300 px-4 py-2 text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="bg-grey-100 rounded-md border-2 border-grey-300 px-4 py-2 text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <Alert status="error" borderRadius="xl">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="flex gap-1">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={showLoadingSpinner}
              >
                Sign In
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export function LoginNav({ showLoadingSpinner, setShowLoadingSpinner }) {
  return (
    <nav
      id="explore"
      className=" flex flex-row justify-between items-center h-[40px] w-full"
    >
      <div
        id="profile-pic"
        className="bg-monstera-200 drop-shadow-sm w-[40px] h-[40px] flex justify-center items-center rounded-full"
      >
        <Image
          src="/images/memoji/male-1.png"
          width="30"
          height="30"
          className="drop-shadow"
        />
      </div>
      <div className="flex flex-row gap-4">
        <SignInButton
          showLoadingSpinner={showLoadingSpinner}
          setShowLoadingSpinner={setShowLoadingSpinner}
        />
        <SignUpButton
          showLoadingSpinner={showLoadingSpinner}
          setShowLoadingSpinner={setShowLoadingSpinner}
        />
      </div>
    </nav>
  );
}

export function SignOutNav({ setShowLoadingSpinner, showLoadingSpinner }) {
  const { logOut, user } = useUserAuth();

  return (
    <nav
      id="explore"
      className=" flex flex-row justify-between items-center h-[40px] w-full"
    >
      <div
        id="profile-pic"
        className="bg-monstera-200 drop-shadow-sm w-[40px] h-[40px] flex justify-center items-center rounded-full"
      >
        <Image
          src="/images/memoji/male-1.png"
          width="30"
          height="30"
          className="drop-shadow"
        />
      </div>
      <div className="flex items-center flex-row gap-4 text-white">
        <div className="text-sm">{user.email}</div>
        <Button
          id="exchange-button"
          className="bg-white drop-shadow-sm rounded-full text-grey-600 px-4 py-2 text-center font-[558] transition-all"
          borderRadius="999px"
          leftIcon={<p>🚪</p>}
          isLoading={showLoadingSpinner}
          onClick={() => {
            setShowLoadingSpinner(true);
            setTimeout(() => {
              logOut();
              setShowLoadingSpinner(false);
            }, 400);
          }}
        >
          Log Out
        </Button>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  const { user } = useUserAuth();

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  return (
    <div className=" text-white">
      <header className="flex flex-col gap-4 mt-4 mx-6">
        {user ? (
          <SignOutNav
            // user={name}
            setShowLoadingSpinner={setShowLoadingSpinner}
            showLoadingSpinner={showLoadingSpinner}
          />
        ) : (
          <LoginNav
            showLoadingSpinner={showLoadingSpinner}
            setShowLoadingSpinner={setShowLoadingSpinner}
          />
        )}
        <div
          id="title-area"
          className="flex flex-row justify-between items-end w-full"
        >
          <div className="flex flex-row items-baseline gap-3">
            <h1 className="font-alpina">Indoor Garden</h1>
            <div></div>
          </div>
          <Image src="/images/sun.svg" width="35" height="35" />
        </div>
        <div className="line w-full h-[1px] bg-white opacity-75 -translate-y-2 mb-4"></div>
      </header>
      {children}
      <footer className="flex flex-col justify-center items-center">
        <div className="line w-full h-[1px] bg-white opacity-75 -translate-y-1"></div>
        👀👀
      </footer>
    </div>
  );
}
