'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isUuid } from '@/lib/supabase/validation'

export async function updateRank(rankId: string) {
  if (!isUuid(rankId)) throw new Error('Invalid rank selected.')
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('You must be signed in to update your rank.')
  }

  // Verify rank exists
  const { data: rank, error: rankError } = await supabase
    .from('ranks')
    .select('id, name')
    .eq('id', rankId)
    .single()

  if (rankError || !rank) {
    throw new Error('Invalid rank selected.')
  }

  // Upsert profile with new rank
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        current_rank_id: rankId,
      },
      { onConflict: 'id' }
    )

  if (upsertError) {
    throw new Error('Unable to save your rank. Please try again.')
  }

  revalidatePath('/profile')
  revalidatePath('/recommendations')
  revalidatePath('/progress')
  revalidatePath('/', 'layout')

  return { success: true, rankName: rank.name }
}
