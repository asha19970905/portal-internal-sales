export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import styles from './page.module.css'
import { PoChart, ClaimChart } from '@/components/DashboardCharts'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  // Aggregate PO Data
  const incomingPO = await prisma.pO.count()
  const processingPO = await prisma.pO.count({ where: { status: 'Proses' } })
  const donePO = await prisma.pO.count({ where: { status: 'Selesai' } })

  // Aggregate Claim Data
  const openClaim = await prisma.claimMemo.count({ where: { keterangan: 'Open' } })
  const closeClaim = await prisma.claimMemo.count({ where: { keterangan: 'Close' } })

  // Aggregate PO per month for current year
  const allPOs = await prisma.pO.findMany({ select: { tanggalPo: true } })
  const currentYear = new Date().getFullYear()
  const poPerMonth = new Array(12).fill(0)
  
  allPOs.forEach((po) => {
    const date = new Date(po.tanggalPo)
    if (date.getFullYear() === currentYear) {
      poPerMonth[date.getMonth()]++
    }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>PO Masuk</span>
          <span className={styles.statValue}>{incomingPO}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>PO Diproses</span>
          <span className={styles.statValue} style={{color: 'var(--warning-color)'}}>{processingPO}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>PO Selesai</span>
          <span className={styles.statValue} style={{color: 'var(--success-color)'}}>{donePO}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Claim Open</span>
          <span className={styles.statValue} style={{color: 'var(--danger-color)'}}>{openClaim}</span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Grafik PO Tahun {currentYear}</h3>
          <div className={styles.chartContainer}>
            <PoChart data={poPerMonth} />
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h3>Status Claim Memo</h3>
          <div className={styles.chartContainer}>
            {openClaim === 0 && closeClaim === 0 ? (
              <div style={{display: 'flex', height: '100%', alignItems:'center', justifyContent:'center', color: 'var(--text-muted)'}}>Belum ada data</div>
            ) : (
              <ClaimChart open={openClaim} close={closeClaim} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
