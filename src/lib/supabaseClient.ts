import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrwigbnoduaanfhbtdzg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd2lnYm5vZHVhYW5maGJ0ZHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzk0MDcsImV4cCI6MjA3NDI1NTQwN30.TlFSx5bS5DK82fS6NdkfLFVuPwYSradGZuMBDQA3pJU'
export const supabase = createClient(supabaseUrl, supabaseKey)
