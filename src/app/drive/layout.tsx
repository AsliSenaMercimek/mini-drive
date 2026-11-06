import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DriveShell } from '@/components/drive/DriveShell'

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <DriveShell userEmail={user.email}>
      {children}
    </DriveShell>
  )
}
