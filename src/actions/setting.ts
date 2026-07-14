'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateProcedureText(content: string) {
  try {
    await prisma.appSetting.upsert({
      where: { key: 'PROCEDURE_TEXT' },
      update: { value: content },
      create: { key: 'PROCEDURE_TEXT', value: content },
    })
    revalidatePath('/bantuan')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menyimpan prosedur' }
  }
}
