export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import PoClient from './PoClient'

const prisma = new PrismaClient()

export default async function PoPopPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const q = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where = {
    OR: [
      { no: { contains: q } },
      { namaCustomer: { contains: q } },
      { pic: { contains: q } },
      { sbr: { contains: q } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.pO.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pO.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <PoClient 
      initialData={data} 
      totalPages={totalPages} 
      currentPage={page} 
      query={q} 
    />
  )
}
