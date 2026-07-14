'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function createUser(data: any) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menambah pengguna (Email mungkin sudah digunakan)' }
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    }
    
    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal mengubah pengguna' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menghapus pengguna' }
  }
}
