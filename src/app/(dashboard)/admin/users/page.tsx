import { PrismaClient } from '@prisma/client'
import UsersClient from './UsersClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  return (
    <UsersClient users={users} currentUserId={session.user.id} />
  )
}
