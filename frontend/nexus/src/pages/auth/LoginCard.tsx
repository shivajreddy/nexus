import "@assets/pages/User/authorization.css";

import LoginForm from "./LoginForm";

interface Iprops {
  isLoginPage: boolean;
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginCard({ isLoginPage, setIsLoginPage }: Iprops) {
  // ! 2. Define form

  return (
    <div className="p-10 flex flex-col justify-center w-[100%]">
      <p className="font-bold text-4xl">Log In</p>
      <p>Pick up where you left off</p>
      <LoginForm isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
    </div>
  );
}

export default LoginCard;
