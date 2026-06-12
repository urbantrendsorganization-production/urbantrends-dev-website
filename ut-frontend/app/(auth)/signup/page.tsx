import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Start building with UrbanTrends.",
};

export default function SignupPage() {
  return <SignupForm />;
}
