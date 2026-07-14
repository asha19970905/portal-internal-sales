'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createPo(data: any) {
  try {
    await prisma.pO.create({
      data: {
        no: data.no,
        tanggalPo: new Date(data.tanggalPo),
        pic: data.pic,
        namaCustomer: data.namaCustomer,
        sbr: data.sbr,
        noQt2: data.noQt2,
        jumlahItem: parseInt(data.jumlahItem),
        tanggalInput: new Date(data.tanggalInput),
        jam: data.jam,
        tanggalTerimaPop: data.tanggalTerimaPop ? new Date(data.tanggalTerimaPop) : null,
        jamTerima: data.jamTerima || null,
        noSo: data.noSo || null,
        status: data.status || 'Proses',
      },
    })
    revalidatePath('/po-pop')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menambahkan data' }
  }
}

export async function updatePo(id: string, data: any) {
  try {
    await prisma.pO.update({
      where: { id },
      data: {
        no: data.no,
        tanggalPo: new Date(data.tanggalPo),
        pic: data.pic,
        namaCustomer: data.namaCustomer,
        sbr: data.sbr,
        noQt2: data.noQt2,
        jumlahItem: parseInt(data.jumlahItem),
        tanggalInput: new Date(data.tanggalInput),
        jam: data.jam,
        tanggalTerimaPop: data.tanggalTerimaPop ? new Date(data.tanggalTerimaPop) : null,
        jamTerima: data.jamTerima || null,
        noSo: data.noSo || null,
        status: data.status,
      },
    })
    revalidatePath('/po-pop')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal mengubah data' }
  }
}

export async function deletePo(id: string) {
  try {
    await prisma.pO.delete({ where: { id } })
    revalidatePath('/po-pop')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Gagal menghapus data' }
  }
}
