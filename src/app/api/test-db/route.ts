import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@portal.com' },
    })
    
    if (admin) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Koneksi ke database BERHASIL!',
        userFound: admin.email,
        dbUrl: process.env.DATABASE_URL?.substring(0, 30) + '...' // Hanya untuk mengecek apakah terisi
      })
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Koneksi berhasil, tetapi user tidak ditemukan. Seeding gagal?' 
      })
    }
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Gagal terhubung ke database',
      errorName: error.name,
      errorMessage: error.message,
      dbUrl: process.env.DATABASE_URL?.substring(0, 30) + '...'
    })
  }
}
