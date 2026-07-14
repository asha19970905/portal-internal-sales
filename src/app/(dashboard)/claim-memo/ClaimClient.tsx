'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Modal from '@/components/Modal'
import { createClaim, updateClaim, deleteClaim } from '@/actions/claim'
import styles from '../po-pop/page.module.css'

export default function ClaimClient({ initialData, totalPages, currentPage, query }: any) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(query)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/claim-memo?q=${searchTerm}&page=1`)
  }

  const changePage = (newPage: number) => {
    router.push(`/claim-memo?q=${searchTerm}&page=${newPage}`)
  }

  const openAddModal = () => {
    setEditingData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingData(item)
    setIsModalOpen(true)
  }

  const openDetailModal = (item: any) => {
    setEditingData(item)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      await deleteClaim(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    if (editingData) {
      await updateClaim(editingData.id, data)
    } else {
      await createClaim(data)
    }
    
    setLoading(false)
    setIsModalOpen(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toISOString().split('T')[0]
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Data Claim Memo</h1>
        <div className={styles.actions}>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Cari No Claim / Customer..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button className={styles.addBtn} onClick={openAddModal}>
            <Plus size={18} /> Tambah Data
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>No Claim</th>
              <th>Tanggal</th>
              <th>Customer</th>
              <th>Spec</th>
              <th>Dimensi (mm)</th>
              <th>Qty Claim</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialData.length === 0 ? (
              <tr><td colSpan={9} style={{textAlign: 'center'}}>Tidak ada data ditemukan</td></tr>
            ) : (
              initialData.map((item: any, idx: number) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{item.noClaim}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td>{item.customer}</td>
                  <td>{item.spec}</td>
                  <td>{item.diameter} x {item.tebal} x {item.panjang}</td>
                  <td>{item.qtyClaim}</td>
                  <td>
                    <span className={`${styles.badge} ${item.keterangan === 'Open' ? styles.statusProses : styles.statusSelesai}`}>
                      {item.keterangan}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.iconBtn} onClick={() => openDetailModal(item)} title="Detail"><Eye size={16} /></button>
                      <button className={styles.iconBtn} onClick={() => openEditModal(item)} title="Edit"><Edit size={16} /></button>
                      <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(item.id)} title="Hapus"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            Prev
          </button>
          <span>Hal {currentPage} dari {totalPages}</span>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Data Claim' : 'Tambah Data Claim'}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Tanggal</label>
              <input type="date" name="tanggal" defaultValue={editingData ? formatDate(editingData.tanggal) : ''} required />
            </div>
            <div className={styles.formGroup}>
              <label>No Claim</label>
              <input type="text" name="noClaim" defaultValue={editingData?.noClaim} required />
            </div>
            <div className={styles.formGroup}>
              <label>Customer</label>
              <input type="text" name="customer" defaultValue={editingData?.customer} required />
            </div>
            <div className={styles.formGroup}>
              <label>No SPPB</label>
              <input type="text" name="noSppb" defaultValue={editingData?.noSppb} required />
            </div>
            <div className={styles.formGroup}>
              <label>Spec</label>
              <input type="text" name="spec" defaultValue={editingData?.spec} required />
            </div>
            <div className={styles.formGroup}>
              <label>Diameter (mm)</label>
              <input type="number" step="0.01" name="diameter" defaultValue={editingData?.diameter} required />
            </div>
            <div className={styles.formGroup}>
              <label>Tebal (mm)</label>
              <input type="number" step="0.01" name="tebal" defaultValue={editingData?.tebal} required />
            </div>
            <div className={styles.formGroup}>
              <label>Panjang (mm)</label>
              <input type="number" step="0.01" name="panjang" defaultValue={editingData?.panjang} required />
            </div>
            <div className={styles.formGroup}>
              <label>Qty SPPB</label>
              <input type="number" name="qtySppb" defaultValue={editingData?.qtySppb} required />
            </div>
            <div className={styles.formGroup}>
              <label>Qty Claim</label>
              <input type="number" name="qtyClaim" defaultValue={editingData?.qtyClaim} required />
            </div>
            <div className={styles.formGroup}>
              <label>Jenis Claim</label>
              <input type="text" name="jenisClaim" defaultValue={editingData?.jenisClaim} required />
            </div>
            <div className={styles.formGroup}>
              <label>Disposisi</label>
              <input type="text" name="disposisi" defaultValue={editingData?.disposisi} required />
            </div>
            <div className={styles.formGroup}>
              <label>Keterangan</label>
              <select name="keterangan" defaultValue={editingData?.keterangan || 'Open'}>
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
              <label>Remarks</label>
              <input type="text" name="remarks" defaultValue={editingData?.remarks} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Claim Memo">
        {editingData && (
          <div>
            <div className={styles.detailHeader}>
              <h3>{editingData.noClaim}</h3>
              <span className={`${styles.badge} ${editingData.keterangan === 'Open' ? styles.statusProses : styles.statusSelesai}`} style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                {editingData.keterangan}
              </span>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>No Urut</span>
                <span className={styles.detailValue}>{editingData.no}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tanggal</span>
                <span className={styles.detailValue}>{formatDate(editingData.tanggal)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>{editingData.customer}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>No SPPB</span>
                <span className={styles.detailValue}>{editingData.noSppb}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Spec</span>
                <span className={styles.detailValue}>{editingData.spec}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dimensi (D x T x P)</span>
                <span className={styles.detailValue}>{editingData.diameter} x {editingData.tebal} x {editingData.panjang} mm</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Qty SPPB</span>
                <span className={styles.detailValue}>{editingData.qtySppb}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Qty Claim</span>
                <span className={styles.detailValue}>{editingData.qtyClaim}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Jenis Claim</span>
                <span className={styles.detailValue}>{editingData.jenisClaim}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Disposisi</span>
                <span className={styles.detailValue}>{editingData.disposisi}</span>
              </div>
              <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.detailLabel}>Remarks</span>
                <span className={styles.detailValue}>{editingData.remarks || '-'}</span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.formActions}>
          <button type="button" className={styles.btnPrimary} onClick={() => setIsDetailModalOpen(false)}>Tutup</button>
        </div>
      </Modal>

    </div>
  )
}
