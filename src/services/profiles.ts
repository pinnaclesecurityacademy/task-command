import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile } from '../types/task';
import { TC_TABLES } from './tableNames';

export async function getProfile(user: User) {
  const { data, error } = await supabase.from(TC_TABLES.profiles).select('*').eq('id', user.id).single();
  if (error) {
    const fallback = inferName(user.email);
    const { data: created, error: createError } = await supabase
      .from(TC_TABLES.profiles)
      .insert({ id: user.id, display_name: fallback, email: user.email })
      .select('*')
      .single();
    if (createError) throw createError;
    return created as Profile;
  }
  return data as Profile;
}

function inferName(email?: string | null) {
  const local = email?.split('@')[0]?.toLowerCase() ?? '';
  return local.includes('damien') ? 'Damien' : 'Chris';
}
