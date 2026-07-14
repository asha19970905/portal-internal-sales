export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import ClaimClient from './ClaimClient'

const prisma = new PrismaClient()

export default async function ClaimMemoPage({
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
      { noClaim: { contains: q } },
      { customer: { contains: q } },
      { noSppb: { contains: q } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.claimMemo.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.claimMemo.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <ClaimClient 
      initialData={data} 
      totalPages={totalPages} 
      currentPage={page} 
      query={q} 
    />
  )
}
