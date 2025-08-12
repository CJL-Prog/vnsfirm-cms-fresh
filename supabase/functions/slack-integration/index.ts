// supabase/functions/slack-integration/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()

    switch (action) {
      case 'test_connection':
        return await testSlackConnection()
      case 'get_channels':
        return await getSlackChannels()
      case 'send_message':
        return await sendSlackMessage(data, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function testSlackConnection() {
  const botToken = Deno.env.get('SLACK_BOT_TOKEN')
  
  if (!botToken) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Slack API credentials not configured',
        error: 'Missing credentials'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const response = await fetch(
      'https://slack.com/api/auth.test',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${botToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Slack API returned ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.ok) {
      throw new Error(data.error || 'Slack API returned an error')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Slack connection successful!',
        team: data.team,
        user: data.user,
        botId: data.bot_id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Slack connection failed: ${error.message}`,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getSlackChannels() {
  const botToken = Deno.env.get('SLACK_BOT_TOKEN')
  
  if (!botToken) {
    throw new Error('Slack API credentials not configured')
  }

  try {
    // Fetch public channels
    const publicResponse = await fetch(
      'https://slack.com/api/conversations.list?types=public_channel',
      {
        headers: {
          'Authorization': `Bearer ${botToken}`
        }
      }
    )

    if (!publicResponse.ok) {
      throw new Error(`Slack API returned ${publicResponse.status}`)
    }

    const publicData = await publicResponse.json()
    
    if (!publicData.ok) {
      throw new Error(publicData.error || 'Slack API returned an error')
    }

    // Fetch private channels (that the bot is in)
    const privateResponse = await fetch(
      'https://slack.com/api/conversations.list?types=private_channel',
      {
        headers: {
          'Authorization': `Bearer ${botToken}`
        }
      }
    )

    if (!privateResponse.ok) {
      throw new Error(`Slack API returned ${privateResponse.status}`)
    }

    const privateData = await privateResponse.json()
    
    if (!privateData.ok) {
      throw new Error(privateData.error || 'Slack API returned an error')
    }

    // Combine channels
    const channels = [
      ...publicData.channels.map(c => ({
        id: c.id,
        name: c.name,
        isPrivate: false,
        memberCount: c.num_members
      })),
      ...privateData.channels.map(c => ({
        id: c.id,
        name: c.name,
        isPrivate: true,
        memberCount: c.num_members
      }))
    ];

    return new Response(
      JSON.stringify({ 
        success: true, 
        channels
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    throw new Error(`Error fetching Slack channels: ${error.message}`)
  }
}

async function sendSlackMessage(data, supabase) {
  const botToken = Deno.env.get('SLACK_BOT_TOKEN')
  
  if (!botToken) {
    throw new Error('Slack API credentials not configured')
  }

  const { channel, text, blocks, clientId, messageType } = data
  
  if (!channel || (!text && !blocks)) {
    throw new Error('Channel and message text/blocks are required')
  }

  try {
    // Prepare message payload
    const payload = {
      channel,
      text: text || 'Message from VNS Firm CMS'
    }

    if (blocks) {
      payload.blocks = blocks
    }

    // Send message to Slack
    const response = await fetch(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      throw new Error(`Slack API returned ${response.status}`)
    }

    const responseData = await response.json()
    
    if (!responseData.ok) {
      throw new Error(responseData.error || 'Slack API returned an error')
    }

    // Log the activity in Supabase if clientId is provided
    if (clientId) {
      await supabase
        .from('collection_efforts')
        .insert([{
          client_id: clientId,
          type: messageType || 'SLACK',
          message: `Sent Slack message: "${text?.substring(0, 50)}${text?.length > 50 ? '...' : ''}"`,
          sent_date: new Date().toISOString().split('T')[0],
          status: 'Sent',
          created_by: 'system'
        }])
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.ts,
        channel: responseData.channel
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    throw new Error(`Error sending Slack message: ${error.message}`)
  }
}