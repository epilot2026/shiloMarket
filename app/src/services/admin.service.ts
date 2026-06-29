import { supabase } from '../lib/supabase'
import type { AccountType, UserRole } from '../types'

export interface AdminUserRow {
  id: string
  fullName: string
  phone: string
  accountType: AccountType
  role: UserRole
  verified: boolean
  location: string | null
  createdAt: string
}

export interface AdminAnnonceRow {
  id: string
  title: string
  authorName: string
  category: string
  transaction: string
  price: number
  status: string
  certified: boolean
  createdAt: string
}

export interface AdminPageRow {
  id: string
  name: string
  type: string
  ownerName: string
  verified: boolean
  followers: number
  location: string | null
}

export interface AdminStats {
  totalUsers: number
  totalAnnonces: number
  totalPages: number
  totalShorts: number
  totalComments: number
  totalMessages: number
  certifiedAnnonces: number
  verifiedPages: number
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const [users, annonces, pages, shorts, comments, messages, certAnnonces, verifPages] =
      await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('annonces').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('shorts').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('annonces').select('*', { count: 'exact', head: true }).eq('certified', true),
        supabase.from('pages').select('*', { count: 'exact', head: true }).eq('verified', true),
      ])

    return {
      totalUsers: users.count || 0,
      totalAnnonces: annonces.count || 0,
      totalPages: pages.count || 0,
      totalShorts: shorts.count || 0,
      totalComments: comments.count || 0,
      totalMessages: messages.count || 0,
      certifiedAnnonces: certAnnonces.count || 0,
      verifiedPages: verifPages.count || 0,
    }
  },

  async listUsers(): Promise<AdminUserRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, account_type, role, verified, location, created_at')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      accountType: row.account_type as AccountType,
      role: (row.role as UserRole) || 'user',
      verified: row.verified || false,
      location: row.location,
      createdAt: new Date(row.created_at).toLocaleDateString('fr-FR'),
    }))
  },

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) throw new Error(error.message)
  },

  async verifyUser(userId: string, verified: boolean): Promise<void> {
    const { error } = await supabase.from('profiles').update({ verified }).eq('id', userId)
    if (error) throw new Error(error.message)
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) throw new Error(error.message)
  },

  async listAnnonces(): Promise<AdminAnnonceRow[]> {
    const { data, error } = await supabase
      .from('annonces')
      .select('id, title, category, transaction, price, status, certified, created_at, author:profiles(full_name)')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      authorName: (row.author as unknown as Record<string, unknown>)?.full_name as string || 'Inconnu',
      category: row.category,
      transaction: row.transaction,
      price: row.price,
      status: row.status,
      certified: row.certified || false,
      createdAt: new Date(row.created_at).toLocaleDateString('fr-FR'),
    }))
  },

  async certifyAnnonce(annonceId: string, certified: boolean): Promise<void> {
    const { error } = await supabase.from('annonces').update({ certified }).eq('id', annonceId)
    if (error) throw new Error(error.message)
  },

  async deleteAnnonce(annonceId: string): Promise<void> {
    const { error } = await supabase.from('annonces').delete().eq('id', annonceId)
    if (error) throw new Error(error.message)
  },

  async listPages(): Promise<AdminPageRow[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('id, name, type, verified, followers_count, location, owner:profiles(full_name)')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      ownerName: (row.owner as unknown as Record<string, unknown>)?.full_name as string || 'Inconnu',
      verified: row.verified || false,
      followers: row.followers_count || 0,
      location: row.location,
    }))
  },

  async verifyPage(pageId: string, verified: boolean): Promise<void> {
    const { error } = await supabase.from('pages').update({ verified }).eq('id', pageId)
    if (error) throw new Error(error.message)
  },

  async deletePage(pageId: string): Promise<void> {
    const { error } = await supabase.from('pages').delete().eq('id', pageId)
    if (error) throw new Error(error.message)
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (error) throw new Error(error.message)
  },

  async deleteShort(shortId: string): Promise<void> {
    const { error } = await supabase.from('shorts').delete().eq('id', shortId)
    if (error) throw new Error(error.message)
  },
}
