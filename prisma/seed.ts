import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('password', 10)
  const userPassword = await bcrypt.hash('password', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@portal.com' },
    update: {},
    create: {
      email: 'admin@portal.com',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@portal.com' },
    update: {},
    create: {
      email: 'user@portal.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log({ admin, user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
