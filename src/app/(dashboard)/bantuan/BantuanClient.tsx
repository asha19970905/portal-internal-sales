'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal'
import { createVideo, updateVideo, deleteVideo } from '@/actions/video'
import styles from './page.module.css'
import formStyles from '../po-pop/page.module.css'

export default function BantuanClient({ videos, isAdmin, initialProcedure }: { videos: any[], isAdmin: boolean, initialProcedure: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcModalOpen, setIsProcModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const openAddModal = () => {
    setEditingData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      await deleteVideo(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File
    
    let videoUrl = editingData?.videoUrl

    if (!editingData && (!file || file.size === 0)) {
      alert('Pilih video terlebih dahulu')
      setLoading(false)
      return
    }

    if (file && file.size > 0) {
      setUploading(true)
      // Simulate progress for UI since fetch doesn't support upload progress natively easily without XHR
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10))
      }, 300)

      const uploadData = new FormData()
      uploadData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      const resData = await res.json()
      if (resData.success) {
        videoUrl = resData.url
      } else {
        alert('Gagal mengupload video')
        setLoading(false)
        setUploading(false)
        return
      }
    }

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      videoUrl
    }

    if (editingData) {
      await updateVideo(editingData.id, data)
    } else {
      await createVideo(data)
    }
    
    setLoading(false)
    setUploading(false)
    setUploadProgress(0)
    setIsModalOpen(false)
  }

  const handleProcSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const content = formData.get('content') as string
    
    const { updateProcedureText } = await import('@/actions/setting')
    await updateProcedureText(content)
    
    setLoading(false)
    setIsProcModalOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.title}>Prosedur & Informasi</h1>
          {isAdmin && (
            <button className={formStyles.iconBtn} onClick={() => setIsProcModalOpen(true)} title="Edit Prosedur">
              <Edit size={18} /> Edit
            </button>
          )}
        </div>
        <div className={styles.procedureText}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '1rem', background: 'transparent', padding: 0, border: 'none' }}>
            {initialProcedure}
          </pre>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Video Tutorial</h2>
          {isAdmin && (
            <button className={formStyles.addBtn} onClick={openAddModal}>
              <Plus size={18} /> Tambah Video
            </button>
          )}
        </div>

        {videos.length === 0 ? (
          <p style={{color: 'var(--text-muted)'}}>Belum ada video tutorial yang ditambahkan.</p>
        ) : (
          <div className={styles.videoGrid}>
            {videos.map(video => (
              <div key={video.id} className={styles.videoCard}>
                <div className={styles.videoWrapper}>
                  <video className={styles.videoPlayer} controls src={video.videoUrl} preload="metadata" />
                </div>
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoDesc}>{video.description}</p>
                  
                  {isAdmin && (
                    <div className={styles.videoActions}>
                      <button className={formStyles.iconBtn} onClick={() => openEditModal(video)} title="Edit"><Edit size={16} /></button>
                      <button className={`${formStyles.iconBtn} ${formStyles.delete}`} onClick={() => handleDelete(video.id)} title="Hapus"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Video Tutorial' : 'Tambah Video Tutorial'}>
        <form onSubmit={handleSubmit}>
          <div className={formStyles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Judul Video</label>
            <input type="text" name="title" defaultValue={editingData?.title} required />
          </div>
          <div className={formStyles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Deskripsi Singkat</label>
            <input type="text" name="description" defaultValue={editingData?.description} />
          </div>
          {!editingData && (
            <div className={formStyles.formGroup} style={{marginBottom: '1rem'}}>
              <label>Pilih File Video</label>
              <input type="file" name="file" accept="video/*" required={!editingData} />
            </div>
          )}
          
          {uploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{width: `${uploadProgress}%`}}></div>
            </div>
          )}
          
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className={formStyles.btnPrimary} disabled={loading || uploading}>
              {loading ? (uploading ? `Mengupload... ${uploadProgress}%` : 'Menyimpan...') : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isProcModalOpen} onClose={() => setIsProcModalOpen(false)} title="Edit Prosedur & Informasi">
        <form onSubmit={handleProcSubmit}>
          <div className={formStyles.formGroup} style={{marginBottom: '1rem'}}>
            <label>Konten Prosedur</label>
            <textarea 
              name="content" 
              defaultValue={initialProcedure} 
              required 
              rows={12}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--surface-color)', color: 'var(--text-color)' }}
            />
          </div>
          <div className={formStyles.formActions}>
            <button type="button" className={formStyles.btnSecondary} onClick={() => setIsProcModalOpen(false)}>Batal</button>
            <button type="submit" className={formStyles.btnPrimary} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
