'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isUuid } from '@/lib/supabase/validation'

export type MechanicStatus = 'learning' | 'mastered'

export type UpdateMechanicStatusResult =
  | { success: true; status: MechanicStatus | null; error?: never }
  | { success?: never; status?: never; error: string }

/**
 * Updates or removes the status of a mechanic for the currently authenticated user.
 * - If status is null: deletes the record from user_mechanics.
 * - If status is 'learning' or 'mastered': upserts the record into user_mechanics.
 * Revalidates /mechanics, /profile, and optionally the specific mechanic page.
 */
export async function updateMechanicStatus(
  mechanicId: string,
  status: MechanicStatus | null,
  pathSlug?: string
): Promise<UpdateMechanicStatusResult> {
  if (!isUuid(mechanicId)) {
    return { error: 'Invalid mechanic ID' }
  }

  if (status !== null && status !== 'learning' && status !== 'mastered') {
    return { error: 'Invalid mechanic status' }
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  if (status === null) {
    const { error: deleteError } = await supabase
      .from('user_mechanics')
      .delete()
      .eq('user_id', user.id)
      .eq('mechanic_id', mechanicId)

    if (deleteError) {
      return { error: deleteError.message }
    }
  } else {
    const { error: upsertError } = await supabase
      .from('user_mechanics')
      .upsert(
        {
          user_id: user.id,
          mechanic_id: mechanicId,
          status,
        },
        { onConflict: 'user_id,mechanic_id' }
      )

    if (upsertError) {
      return { error: upsertError.message }
    }
  }

  revalidatePath('/mechanics')
  revalidatePath('/profile')
  revalidatePath('/progress')
  revalidatePath('/recommendations')
  if (typeof pathSlug === 'string' && /^[a-z0-9-]+$/.test(pathSlug)) {
    revalidatePath(`/mechanics/${pathSlug}`)
  }

  return { success: true, status }
}
