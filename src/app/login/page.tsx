'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HardDrive, Mail, Lock, AlertCircle, Sun, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { useTheme } from '@/components/ThemeProvider'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { resolvedTheme, toggleTheme } = useTheme()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Giriş Formu State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginEmailError, setLoginEmailError] = useState<string | null>(null)
  const [loginPasswordError, setLoginPasswordError] = useState<string | null>(null)
  const [loginGeneralError, setLoginGeneralError] = useState<string | null>(null)

  // Kayıt Formu State
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerEmailError, setRegisterEmailError] = useState<string | null>(null)
  const [registerPasswordError, setRegisterPasswordError] = useState<string | null>(null)
  const [registerGeneralError, setRegisterGeneralError] = useState<string | null>(null)

  function translateError(errorMsg: string): string {
    const lower = errorMsg.toLowerCase()
    if (lower.includes('invalid login credentials')) {
      return 'E-posta veya şifre hatalı.'
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.'
    }
    if (lower.includes('password should be at least')) {
      return 'Şifre en az 6 karakter olmalıdır.'
    }
    if (lower.includes('email not confirmed')) {
      return 'E-posta adresi henüz doğrulanmamış.'
    }
    if (lower.includes('invalid email') || lower.includes('valid email')) {
      return 'Geçerli bir e-posta adresi girin.'
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyin.'
    }
    return errorMsg || 'İşlem gerçekleştirilemedi.'
  }

  // GİRİŞ YAP
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    console.log('[LoginPage] handleLogin triggered:', { loginEmail, passLen: loginPassword?.length })
    setLoginEmailError(null)
    setLoginPasswordError(null)
    setLoginGeneralError(null)

    let hasError = false
    const trimmedEmail = loginEmail.trim()

    if (!trimmedEmail) {
      setLoginEmailError('E-posta adresi gerekli.')
      hasError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setLoginEmailError('Geçerli bir e-posta adresi girin.')
      hasError = true
    }

    if (!loginPassword) {
      setLoginPasswordError('Şifre gerekli.')
      hasError = true
    } else if (loginPassword.length < 6) {
      setLoginPasswordError('Şifre en az 6 karakter olmalıdır.')
      hasError = true
    }

    if (hasError) {
      toast({
        title: 'Eksik veya hatalı bilgi',
        description: 'Lütfen form alanlarını kontrol edin.',
        variant: 'error',
      })
      return
    }

    setLoginLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: loginPassword,
      })
      console.log('[LoginPage] signIn result:', { hasSession: Boolean(data?.session), error: error?.message })

      if (error) {
        const message = translateError(error.message)
        setLoginGeneralError(message)
        toast({
          title: 'Giriş yapılamadı',
          description: message,
          variant: 'error',
        })
        setLoginLoading(false)
        return
      }

      if (data.session) {
        toast({
          title: 'Giriş başarılı',
          description: 'Yönlendiriliyorsunuz...',
          variant: 'success',
        })
        router.push('/drive')
        router.refresh()
      }
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : 'Bağlantı hatası oluştu.'
      const message = translateError(rawMessage)
      setLoginGeneralError(message)
      toast({
        title: 'Giriş yapılamadı',
        description: message,
        variant: 'error',
      })
      setLoginLoading(false)
    }
  }

  // KAYIT OL
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegisterEmailError(null)
    setRegisterPasswordError(null)
    setRegisterGeneralError(null)

    let hasError = false
    const trimmedEmail = registerEmail.trim()

    if (!trimmedEmail) {
      setRegisterEmailError('E-posta adresi gerekli.')
      hasError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRegisterEmailError('Geçerli bir e-posta adresi girin.')
      hasError = true
    }

    if (!registerPassword) {
      setRegisterPasswordError('Şifre gerekli.')
      hasError = true
    } else if (registerPassword.length < 6) {
      setRegisterPasswordError('Şifre en az 6 karakter olmalıdır.')
      hasError = true
    }

    if (hasError) {
      toast({
        title: 'Eksik veya hatalı bilgi',
        description: 'Lütfen form alanlarını kontrol edin.',
        variant: 'error',
      })
      return
    }

    setRegisterLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: registerPassword,
      })

      if (error) {
        const message = translateError(error.message)
        setRegisterGeneralError(message)
        toast({
          title: 'Kayıt yapılamadı',
          description: message,
          variant: 'error',
        })
        setRegisterLoading(false)
        return
      }

      if (data.session) {
        toast({
          title: 'Kayıt başarılı',
          description: 'Yönlendiriliyorsunuz...',
          variant: 'success',
        })
        router.push('/drive')
        router.refresh()
      } else {
        toast({
          title: 'Kayıt tamamlandı',
          description: 'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
          variant: 'success',
        })
        setLoginEmail(trimmedEmail)
        setMode('login')
        setRegisterLoading(false)
      }
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : 'Bağlantı hatası oluştu.'
      const message = translateError(rawMessage)
      setRegisterGeneralError(message)
      toast({
        title: 'Kayıt yapılamadı',
        description: message,
        variant: 'error',
      })
      setRegisterLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-bg-base">
      {/* Sağ Üst Tema Değiştirici */}
      <div className="absolute top-4 right-4">
        <IconButton
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={resolvedTheme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
          title={resolvedTheme === 'dark' ? 'Açık tema' : 'Koyu tema'}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          ) : (
            <Moon className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          )}
        </IconButton>
      </div>

      <div className="w-full max-w-[360px] rounded-[8px] border border-border-default bg-bg-surface p-6 shadow-dropdown">
        {/* Logo ve Başlık */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-default bg-bg-subtle text-text-primary">
            <HardDrive className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <span className="text-base font-medium text-text-primary tracking-tight">
            Mini Drive
          </span>
        </div>
        <p className="text-xs text-text-secondary mb-5">
          Bulut dosya depolama ve yönetim alanı
        </p>

        {/* Sekmeler */}
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as 'login' | 'register')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" onClick={() => setMode('login')}>
              Giriş Yap
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => setMode('register')}>
              Kayıt Ol
            </TabsTrigger>
          </TabsList>

          {/* GİRİŞ YAP SEKME İÇERİĞİ */}
          <TabsContent value="login" className="mt-0 space-y-3.5">
            <form id="login-form" onSubmit={handleLogin} noValidate className="space-y-3.5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  E-posta
                </label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ad@ornek.com"
                  value={loginEmail}
                  disabled={loginLoading}
                  error={Boolean(loginEmailError || loginGeneralError)}
                  onChange={(e) => {
                    setLoginEmail(e.target.value)
                    if (loginEmailError) setLoginEmailError(null)
                    if (loginGeneralError) setLoginGeneralError(null)
                  }}
                  prefixIcon={<Mail className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                {loginEmailError && (
                  <p className="text-xs text-danger mt-1 leading-tight">
                    {loginEmailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Şifre
                </label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  disabled={loginLoading}
                  error={Boolean(loginPasswordError || loginGeneralError)}
                  onChange={(e) => {
                    setLoginPassword(e.target.value)
                    if (loginPasswordError) setLoginPasswordError(null)
                    if (loginGeneralError) setLoginGeneralError(null)
                  }}
                  prefixIcon={<Lock className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                {loginPasswordError && (
                  <p className="text-xs text-danger mt-1 leading-tight">
                    {loginPasswordError}
                  </p>
                )}
              </div>

              {loginGeneralError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-[6px] border border-danger-border bg-danger-subtle p-2.5 text-xs text-danger"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="leading-tight">{loginGeneralError}</span>
                </div>
              )}

              <Button
                id="login-submit-btn"
                type="submit"
                variant="primary"
                loading={loginLoading}
                disabled={loginLoading}
                className="w-full mt-2"
              >
                {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </TabsContent>

          {/* KAYIT OL SEKME İÇERİĞİ */}
          <TabsContent value="register" className="mt-0 space-y-3.5">
            <form id="register-form" onSubmit={handleRegister} noValidate className="space-y-3.5">
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  E-posta
                </label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ad@ornek.com"
                  value={registerEmail}
                  disabled={registerLoading}
                  error={Boolean(registerEmailError || registerGeneralError)}
                  onChange={(e) => {
                    setRegisterEmail(e.target.value)
                    if (registerEmailError) setRegisterEmailError(null)
                    if (registerGeneralError) setRegisterGeneralError(null)
                  }}
                  prefixIcon={<Mail className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                {registerEmailError && (
                  <p className="text-xs text-danger mt-1 leading-tight">
                    {registerEmailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Şifre
                </label>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="En az 6 karakter"
                  value={registerPassword}
                  disabled={registerLoading}
                  error={Boolean(registerPasswordError || registerGeneralError)}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value)
                    if (registerPasswordError) setRegisterPasswordError(null)
                    if (registerGeneralError) setRegisterGeneralError(null)
                  }}
                  prefixIcon={<Lock className="h-3.5 w-3.5" strokeWidth={1.75} />}
                />
                {registerPasswordError && (
                  <p className="text-xs text-danger mt-1 leading-tight">
                    {registerPasswordError}
                  </p>
                )}
              </div>

              {registerGeneralError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-[6px] border border-danger-border bg-danger-subtle p-2.5 text-xs text-danger"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="leading-tight">{registerGeneralError}</span>
                </div>
              )}

              <Button
                id="register-submit-btn"
                type="submit"
                variant="primary"
                loading={registerLoading}
                disabled={registerLoading}
                className="w-full mt-2"
              >
                {registerLoading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
