import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, email, fullName, role = 'customer' } = await req.json()

    console.log('Creating profile for user:', { userId, email, fullName, role })

    // Generate username from email
    let username = email.split('@')[0]
    
    // Check if username exists and make it unique
    const { data: existingUser } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      username = `${username}_${Math.floor(Math.random() * 1000)}`
    }

    // Create profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userId,
        username,
        full_name: fullName,
        phone: '',
        role: role as 'admin' | 'customer'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      throw profileError
    }

    console.log('Profile created successfully:', profile)

    return new Response(
      JSON.stringify({ 
        success: true, 
        profile,
        message: 'Profile created successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-profile function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})