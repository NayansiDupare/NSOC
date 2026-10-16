"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    email: z.email("Enter a valid email."),
    github: z.string().min(1, "Enter your GitHub username or URL."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
    linkedin: z.string().optional(),
    referral: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(() => undefined)} noValidate>
      <label>
        Email Address*
        <input type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <small>{errors.email.message}</small> : null}
      </label>
      <label>
        Password*
        <input type="password" autoComplete="current-password" {...register("password")} />
        {errors.password ? <small>{errors.password.message}</small> : null}
      </label>
      <Link className="auth-forgot" href="/forgot-password">
        Forgot Password?
      </Link>
      <Button type="submit">
        Login <ArrowRight size={16} />
      </Button>
      <p className="auth-switch">
        No account yet? <Link href="/register">Register here</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit(() => undefined)} noValidate>
      <div className="auth-grid">
        <label>
          Full Name*
          <input autoComplete="name" {...register("name")} />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>
        <label>
          Email Address*
          <input type="email" autoComplete="email" {...register("email")} />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>
        <label className="auth-grid__full">
          GitHub Username / URL*
          <input {...register("github")} />
          {errors.github ? <small>{errors.github.message}</small> : null}
        </label>
        <label>
          Password*
          <input type="password" autoComplete="new-password" {...register("password")} />
          {errors.password ? <small>{errors.password.message}</small> : null}
        </label>
        <label>
          Confirm Password*
          <input type="password" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword ? <small>{errors.confirmPassword.message}</small> : null}
        </label>
      </div>
      <p className="auth-optional">Optional Details</p>
      <label>
        LinkedIn Profile
        <input {...register("linkedin")} />
      </label>
      <label>
        Referral Code
        <input {...register("referral")} />
      </label>
      <Button type="submit">
        Create Account <ArrowRight size={16} />
      </Button>
      <p className="auth-switch">
        Already registered? <Link href="/login">Login here</Link>
      </p>
    </form>
  );
}
