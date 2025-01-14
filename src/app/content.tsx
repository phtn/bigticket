import { Home } from "./_components/home";
import { GoogleOneTap } from "./ctx/auth/one-tap";
export const Content = () => {
  return (
    <>
      <Home />
      <GoogleOneTap />
    </>
  );
};
