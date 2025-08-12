// supabase/functions/trello-integration/index.ts
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
        return await testTrelloConnection()
      case 'get_boards':
        return await getBoards()
      case 'get_lists':
        return await getLists(data.boardId)
      case 'create_card':
        return await createCard(data, supabase)
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

async function testTrelloConnection() {
  const apiKey = Deno.env.get('TRELLO_API_KEY')
  const token = Deno.env.get('TRELLO_TOKEN')
  
  if (!apiKey || !token) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Trello API credentials not configured',
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
      `https://api.trello.com/1/members/me?key=${apiKey}&token=${token}`
    )

    if (!response.ok) {
      throw new Error(`Trello API returned ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trello connection successful!',
        username: data.username
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
        message: `Trello connection failed: ${error.message}`,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getBoards() {
  const apiKey = Deno.env.get('TRELLO_API_KEY')
  const token = Deno.env.get('TRELLO_TOKEN')
  
  if (!apiKey || !token) {
    throw new Error('Trello API credentials not configured')
  }

  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`
    )

    if (!response.ok) {
      throw new Error(`Trello API returned ${response.status}`)
    }

    const boards = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        boards: boards.map(board => ({
          id: board.id,
          name: board.name,
          url: board.url
        }))
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    throw new Error(`Error fetching boards: ${error.message}`)
  }
}

async function getLists(boardId) {
  const apiKey = Deno.env.get('TRELLO_API_KEY')
  const token = Deno.env.get('TRELLO_TOKEN')
  
  if (!apiKey || !token) {
    throw new Error('Trello API credentials not configured')
  }

  if (!boardId) {
    throw new Error('Board ID is required')
  }

  try {
    const response = await fetch(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${token}`
    )

    if (!response.ok) {
      throw new Error(`Trello API returned ${response.status}`)
    }

    const lists = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        lists: lists.map(list => ({
          id: list.id,
          name: list.name,
          closed: list.closed
        }))
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    throw new Error(`Error fetching lists: ${error.message}`)
  }
}

async function createCard(data, supabase) {
  const apiKey = Deno.env.get('TRELLO_API_KEY')
  const token = Deno.env.get('TRELLO_TOKEN')
  
  if (!apiKey || !token) {
    throw new Error('Trello API credentials not configured')
  }

  const { listId, name, description, clientId } = data
  
  if (!listId || !name) {
    throw new Error('List ID and card name are required')
  }

  try {
    // Create card in Trello
    const params = new URLSearchParams({
      idList: listId,
      name,
      desc: description || '',
      key: apiKey,
      token: token
    })

    const response = await fetch(
      `https://api.trello.com/1/cards?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Trello API returned ${response.status}: ${errorText}`)
    }

    const card = await response.json()

    // Log the activity in Supabase if clientId is provided
    if (clientId) {
      await supabase
        .from('collection_efforts')
        .insert([{
          client_id: clientId,
          type: 'TRELLO',
          message: `Created Trello card: "${name}"`,
          sent_date: new Date().toISOString().split('T')[0],
          status: 'Created',
          created_by: 'system'
        }])
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        card: {
          id: card.id,
          name: card.name,
          url: card.url,
          shortUrl: card.shortUrl
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    throw new Error(`Error creating card: ${error.message}`)
  }
}