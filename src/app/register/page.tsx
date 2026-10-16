import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth-forms";
import Footer from "@/components/footer";
import { Header } from "@/components/landing";

export const metadata: Metadata = {
  title: "Nexus Spring of Code | Open Source Contribution Program for Developers",
};

export default function RegisterPage() {
  return (
    <>
      <Header solid />
      <main className="auth-page">
        <div className="auth-card">
          <span className="auth-eyebrow">Nexus Spring of Code</span>
          <h1>Create your account</h1>
          <p>Register with your basic profile to start your journey.</p>
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
