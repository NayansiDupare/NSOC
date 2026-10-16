import type { Metadata } from "next";

import { LoginForm } from "@/components/auth-forms";
import Footer from "@/components/footer";
import { Header } from "@/components/landing";

export const metadata: Metadata = {
  title: "Nexus Spring of Code | Open Source Contribution Program for Developers",
};

export default function LoginPage() {
  return (
    <>
      <Header solid />
      <main className="auth-page">
        <div className="auth-card">
          <span className="auth-eyebrow">Welcome back</span>
          <h1>Login</h1>
          <p>Pick up right where you left off.</p>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
