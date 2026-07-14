'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal'
import { createUser, updateUser, deleteUser } from '@/actions/user'
import styles from '../../po-pop/page.module.css' // reuse table styles

export default function UsersClient({ users, currentUserId }: { users: any[], currentUserId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const openAddModal = () => {
    setEditingData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri.')
      return
    }
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      await deleteUser(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    let res
    if (editingData) {
      res = await updateUser(editingData.id, data)
    } else {
      res = await createUser(data)
    }
    
    setLoading(false)
    if (res.success) {
      setIsModalOpen(false)
    } else {
      alert(res.error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kelola Pengguna</h1>
        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={openAddModal}>
            <Plus size={18} /> Tambah Pengguna
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'ADMIN' ? styles.statusSelesai : styles.statusMasuk}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.iconBtn} onClick={() => openEditModal(user)} title="Edit"><Edit size={16} /></button>
                    {user.id !== currentUserId && (
                      <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(user.id)} title="Hapus"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Pengguna' : 'Tambah Pengguna'}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Nama Lengkap</label>
            <input type="text" name="name" defaultValue={editingData?.name} required />
          </div>
          <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Email</label>
            <input type="email" name="email" defaultValue={editingData?.email} required />
          </div>
          <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Password {editingData && '(Kosongkan jika tidak ingin diubah)'}</label>
            <input type="password" name="password" required={!editingData} minLength={6} />
          </div>
          <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Role</label>
            <select name="role" defaultValue={editingData?.role || 'USER'} required>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
