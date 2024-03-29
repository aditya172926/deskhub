import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTokens, GithubUser, Nullable } from "../../types";
import AuthModal from "../AuthModal";
import { invoke } from "@tauri-apps/api/tauri";

type AuthContextType = {
  token: Nullable<string>;
  setShouldShowModal: (param: boolean) => void;
  user: Nullable<GithubUser>;
  setUserProfile: (param: GithubUser) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setShouldShowModal: () => {},
  user: null,
  setUserProfile: () => {}
});

interface Props {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<Nullable<string>>(null);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const [user, setUserProfile] = useState<Nullable<GithubUser>>(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token in auth context ", token);
    const timer = setTimeout(() => {
      if (token) {
        setToken(null);
        setShouldShowModal(true);
      }
    }, 3600000);

    return () => clearTimeout(timer);
  }, [token]);

  const setAccessToken = async (auth_tokens: AuthTokens) => {
    try {
      setToken(auth_tokens.access_token);
      console.log("We got the auth tokens and now setting the state ", auth_tokens);
      const changed_auth_state = await invoke("set_auth_state", {authTokens: auth_tokens});
      console.log("The auth state changed ", changed_auth_state);
      setShouldShowModal(false);
    } catch (error) {
      console.log("Error in setting auth state ", error);
    }
      
  };

  const onCancel = () => {
    setShouldShowModal(false);
    navigate("/");
  };

  // if (!shouldShowModal && !token) {
  //   return (
  //     <Result
  //       status="error"
  //       title="Authentication failed"
  //       subTitle="A github personal access token is required"
  //       extra={[
  //         <Button type="link" key="home" onClick={() => navigate("/")}>
  //           Public Section
  //         </Button>,
  //         <Button
  //           key="retry"
  //           type="primary"
  //           onClick={() => setShouldShowModal(true)}
  //         >
  //           Try again
  //         </Button>,
  //       ]}
  //     />
  //   );
  // }

  return (
    <>
      {shouldShowModal && (
        <AuthModal
          shouldShowModal={shouldShowModal}
          setAccessToken={setAccessToken}
          setUserProfile={setUserProfile}
          onCancel={onCancel}
        />
      )}

      <AuthContext.Provider value={{ token, setShouldShowModal, user, setUserProfile }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
