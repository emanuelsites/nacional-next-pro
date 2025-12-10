import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This function is meant to be called once to create the initial admin user
// No authentication required as it's a bootstrap function

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the admin user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'francilene@nacionaltreinamentos.com.br',
      password: 'francilene2026@',
      email_confirm: true
    })

    if (createError) {
      // If user already exists, try to get them and reset password
      if (createError.message.includes('already been registered')) {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email === 'francilene@nacionaltreinamentos.com.br')
        
        if (existingUser) {
          // Reset password to ensure it's correct
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: 'francilene2026@'
          })
          
          // Set as admin
          await supabaseAdmin
            .from('user_roles')
            .upsert({ user_id: existingUser.id, role: 'admin' }, { onConflict: 'user_id,role' })

          return new Response(
            JSON.stringify({ message: 'User already exists, password reset and set as admin', userId: existingUser.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      throw createError
    }

    // Set the user as admin
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: userData.user.id, role: 'admin' }, { onConflict: 'user_id,role' })

    if (roleError) throw roleError

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', userId: userData.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
