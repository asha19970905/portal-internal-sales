'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import Modal from '@/components/Modal'
import { createPo, updatePo, deletePo } from '@/actions/po'
import styles from './page.module.css'

export default function PoClient({ initialData, totalPages, currentPage, query }: any) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(query)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/po-pop?q=${searchTerm}&page=1`)
  }

  const changePage = (newPage: number) => {
    router.push(`/po-pop?q=${searchTerm}&page=${newPage}`)
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
      await deletePo(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    if (editingData) {
      await updatePo(editingData.id, data)
    } else {
      await createPo(data)
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
        <h1 className={styles.title}>Data PO & POP</h1>
        <div className={styles.actions}>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Cari No PO / Customer..." 
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
              <th>No PO</th>
              <th>Tanggal PO</th>
              <th>PIC</th>
              <th>Customer</th>
              <th>SBR</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialData.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign: 'center'}}>Tidak ada data ditemukan</td></tr>
            ) : (
              initialData.map((item: any, idx: number) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>{item.no}</td>
                  <td>{formatDate(item.tanggalPo)}</td>
                  <td>{item.pic}</td>
                  <td>{item.namaCustomer}</td>
                  <td>{item.sbr}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['status' + item.status]}`}>
                      {item.status}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Data PO' : 'Tambah Data PO'}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>No PO</label>
              <input type="text" name="no" defaultValue={editingData?.no} required />
            </div>
            <div className={styles.formGroup}>
              <label>Tanggal PO</label>
              <input type="date" name="tanggalPo" defaultValue={editingData ? formatDate(editingData.tanggalPo) : ''} required />
            </div>
            <div className={styles.formGroup}>
              <label>PIC</label>
              <input type="text" name="pic" defaultValue={editingData?.pic} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nama Customer</label>
              <input type="text" name="namaCustomer" defaultValue={editingData?.namaCustomer} required />
            </div>
            <div className={styles.formGroup}>
              <label>SBR</label>
              <input type="text" name="sbr" defaultValue={editingData?.sbr} required />
            </div>
            <div className={styles.formGroup}>
              <label>No QT2</label>
              <input type="text" name="noQt2" defaultValue={editingData?.noQt2} required />
            </div>
            <div className={styles.formGroup}>
              <label>Jumlah Item</label>
              <input type="number" name="jumlahItem" defaultValue={editingData?.jumlahItem} required />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select name="status" defaultValue={editingData?.status || 'Proses'} required>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Tanggal Input</label>
              <input type="date" name="tanggalInput" defaultValue={editingData ? formatDate(editingData.tanggalInput) : ''} required />
            </div>
            <div className={styles.formGroup}>
              <label>Jam Input</label>
              <input type="time" name="jam" defaultValue={editingData?.jam} required />
            </div>
            <div className={styles.formGroup}>
              <label>Tanggal Terima POP (Opsional)</label>
              <input type="date" name="tanggalTerimaPop" defaultValue={editingData?.tanggalTerimaPop ? formatDate(editingData.tanggalTerimaPop) : ''} />
            </div>
            <div className={styles.formGroup}>
              <label>Jam Terima POP (Opsional)</label>
              <input type="time" name="jamTerima" defaultValue={editingData?.jamTerima} />
            </div>
            <div className={styles.formGroup}>
              <label>No SO (Opsional)</label>
              <input type="text" name="noSo" defaultValue={editingData?.noSo} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Informasi PO">
        {editingData && (
          <div>
            <div className={styles.detailHeader}>
              <h3>{editingData.no}</h3>
              <span className={`${styles.badge} ${styles['status' + editingData.status]}`} style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                {editingData.status}
              </span>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tanggal PO</span>
                <span className={styles.detailValue}>{formatDate(editingData.tanggalPo)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>PIC</span>
                <span className={styles.detailValue}>{editingData.pic}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>{editingData.namaCustomer}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>SBR</span>
                <span className={styles.detailValue}>{editingData.sbr}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>No QT2</span>
                <span className={styles.detailValue}>{editingData.noQt2}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Jumlah Item</span>
                <span className={styles.detailValue}>{editingData.jumlahItem}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tgl Input</span>
                <span className={styles.detailValue}>{formatDate(editingData.tanggalInput)} {editingData.jam}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tgl Terima POP</span>
                <span className={styles.detailValue}>{editingData.tanggalTerimaPop ? formatDate(editingData.tanggalTerimaPop) + ' ' + editingData.jamTerima : '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>No SO</span>
                <span className={styles.detailValue}>{editingData.noSo || '-'}</span>
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
