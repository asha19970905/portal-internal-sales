const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:%40Paradima05@db.envybxcjbicqmnduzskz.supabase.co:6543/postgres?sslmode=require&pgbouncer=true"
});

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("User found:", user.email);
  } catch (e) {
    console.error("Connection Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
