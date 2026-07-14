'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createVideo(data: any) {
  try {
    await prisma.videoTutorial.create({
      data: {
        title: data.title,
        description: data.description || null,
        videoUrl: data.videoUrl,
      },
    })
    revalidatePath('/bantuan')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menambah video' }
  }
}

export async function updateVideo(id: string, data: any) {
  try {
    await prisma.videoTutorial.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
      },
    })
    revalidatePath('/bantuan')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal mengubah video' }
  }
}

export async function deleteVideo(id: string) {
  try {
    await prisma.videoTutorial.delete({ where: { id } })
    revalidatePath('/bantuan')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menghapus video' }
  }
}
