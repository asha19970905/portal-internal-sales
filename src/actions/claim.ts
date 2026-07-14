'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createClaim(data: any) {
  try {
    let no = data.no
    if (!no) {
      const count = await prisma.claimMemo.count()
      no = String(count + 1)
    }

    await prisma.claimMemo.create({
      data: {
        no: no,
        tanggal: new Date(data.tanggal),
        noClaim: data.noClaim,
        customer: data.customer,
        noSppb: data.noSppb,
        spec: data.spec,
        diameter: parseFloat(data.diameter),
        tebal: parseFloat(data.tebal),
        panjang: parseFloat(data.panjang),
        qtySppb: parseInt(data.qtySppb),
        qtyClaim: parseInt(data.qtyClaim),
        jenisClaim: data.jenisClaim,
        disposisi: data.disposisi,
        keterangan: data.keterangan || 'Open',
        remarks: data.remarks || null,
      },
    })
    revalidatePath('/claim-memo')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menambahkan data' }
  }
}

export async function updateClaim(id: string, data: any) {
  try {
    let no = data.no
    if (!no) {
      const existing = await prisma.claimMemo.findUnique({ where: { id } })
      no = existing?.no || '0'
    }

    await prisma.claimMemo.update({
      where: { id },
      data: {
        no: no,
        tanggal: new Date(data.tanggal),
        noClaim: data.noClaim,
        customer: data.customer,
        noSppb: data.noSppb,
        spec: data.spec,
        diameter: parseFloat(data.diameter),
        tebal: parseFloat(data.tebal),
        panjang: parseFloat(data.panjang),
        qtySppb: parseInt(data.qtySppb),
        qtyClaim: parseInt(data.qtyClaim),
        jenisClaim: data.jenisClaim,
        disposisi: data.disposisi,
        keterangan: data.keterangan,
        remarks: data.remarks || null,
      },
    })
    revalidatePath('/claim-memo')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal mengubah data' }
  }
}

export async function deleteClaim(id: string) {
  try {
    await prisma.claimMemo.delete({ where: { id } })
    revalidatePath('/claim-memo')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menghapus data' }
  }
}
