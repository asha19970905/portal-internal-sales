import { PrismaClient } from '@prisma/client'
import BantuanClient from './BantuanClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export default async function BantuanPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  const videos = await prisma.videoTutorial.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const setting = await prisma.appSetting.findUnique({ where: { key: 'PROCEDURE_TEXT' } })
  const procedureText = setting?.value || 'Selamat datang di Portal Internal Sales. Berikut adalah beberapa prosedur umum:\n\n1. Pastikan data PO yang dimasukkan sudah diverifikasi oleh PIC terkait.\n2. Claim Memo harus diisi dengan spesifikasi yang lengkap dan akurat.\n3. Hubungi tim IT jika Anda mengalami kendala akses atau error pada portal.\n4. Untuk informasi lebih lanjut, silakan tonton video tutorial di bawah.'

  return (
    <BantuanClient videos={videos} isAdmin={isAdmin} initialProcedure={procedureText} />
  )
}
