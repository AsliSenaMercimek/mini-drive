'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { HardDrive, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function translateError(errorMsg: string): string {
    const lower = errorMsg.toLowerCase()
    if (lower.includes('invalid login credentials')) {
      return 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.'
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Bu e-posta adresiyle kayıtlı bir hesap zaten mevcut. Giriş yapmayı deneyin.'
    }
    if (lower.includes('password should be at least')) {
      return 'Şifreniz en az 6 karakter uzunluğunda olmalıdır.'
    }
    if (lower.includes('email not confirmed')) {
      return 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.'
    }
    if (lower.includes('invalid email') || lower.includes('valid email')) {
      return 'Lütfen geçerli bir e-posta adresi girin.'
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.'
    }
    return errorMsg || 'Bir hata oluştu. Lütfen tekrar deneyin.'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setErrorMessage('Lütfen tüm alanları doldurun.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          setErrorMessage(translateError(error.message))
          setLoading(false)
          return
        }

        if (data.session) {
          router.push('/drive')
          router.refresh()
        }
      } else {
        // Kayıt modu
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })

        if (error) {
          setErrorMessage(translateError(error.message))
          setLoading(false)
          return
        }

        // Supabase doğrudan oturum açtıysa /drive'a git, e-posta onayı açıksa bilgi ver
        if (data.session) {
          router.push('/drive')
          router.refresh()
        } else {
          setSuccessMessage(
            'Hesabınız başarıyla oluşturuldu! Supabase projenizde e-posta onayı aktifse lütfen gelen kutunuzu kontrol edin veya şimdi giriş yapmayı deneyin.'
          )
          setMode('login')
          setLoading(false)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Beklenmedik bir hata meydana geldi.'
      setErrorMessage(translateError(msg))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        {/* Başlık ve Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <HardDrive className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Mini Drive
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Güvenli, hızlı ve kullanımı kolay bulut dosya depolama
          </p>
        </div>

        {/* Sekmeler (Giriş Yap / Kayıt Ol) */}
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Bildirim Kutuları */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 p-3.5 text-sm text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              E-posta Adresi
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adiniz@ornek.com"
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              Şifre
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">En az 6 karakter olmalıdır.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lütfen bekleyin...
              </>
            ) : mode === 'login' ? (
              'Giriş Yap'
            ) : (
              'Hesap Oluştur'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
