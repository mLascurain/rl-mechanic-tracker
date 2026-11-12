'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { safeRedirectPath } from '@/lib/supabase/validation'

export interface AuthActionResult {
  error?: string
  success?: boolean
  message?: string
}

export async function loginWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const emailValue = formData.get('email')
  const passwordValue = formData.get('password')
  const email = typeof emailValue === 'string' ? emailValue.trim() : ''
  const password = typeof passwordValue === 'string' ? passwordValue : ''
  const redirectTo = safeRedirectPath(formData.get('redirectTo'))

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function registerWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const emailValue = formData.get('email')
  const passwordValue = formData.get('password')
  const email = typeof emailValue === 'string' ? emailValue.trim() : ''
  const password = typeof passwordValue === 'string' ? passwordValue : ''
  const confirmPassword = formData.get('confirmPassword')
  const redirectTo = safeRedirectPath(formData.get('redirectTo'))

  if (!email || !password) {
    return { error: 'Please fill in all required fields.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createClient()

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const origin = process.env.SITE_URL ?? (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
  const callback = new URL('/auth/callback', origin)
  callback.searchParams.set('next', redirectTo)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callback.toString() },
  })

  if (error) {
    return { error: error.message }
  }

  // If Supabase requires email confirmation and session wasn't immediately created:
  if (data.user && !data.session) {
    return {
      success: true,
      message: 'Account created! Please check your email inbox to confirm your account.',
    }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signOutAction(): Promise<AuthActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) return { error: 'Could not sign out. Please try again.' }
  } catch {
    return { error: 'Could not sign out. Check your connection and try again.' }
  }
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
