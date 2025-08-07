// supabase/functions/lawpay-integration/index.ts
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

    const { action } = await req.json()

    switch (action) {
      case 'test_connection':
        return await testLawPayConnection()
      case 'import_data':
        return await importLawPayData(supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function testLawPayConnection() {
  const apiKey = Deno.env.get('LAWPAY_API_KEY')
  const environment = Deno.env.get('LAWPAY_ENVIRONMENT') || 'sandbox'
  
  if (!apiKey) {
    throw new Error('LawPay API credentials not configured')
  }

  const baseUrl = environment === 'sandbox' 
    ? 'https://api-sandbox.lawpay.com' 
    : 'https://api.lawpay.com'

  const response = await fetch(`${baseUrl}/v1/clients`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`LawPay API connection failed: ${response.status}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `LawPay ${environment} connection successful` 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function importLawPayData(supabase: any) {
  const apiKey = Deno.env.get('LAWPAY_API_KEY')
  const environment = Deno.env.get('LAWPAY_ENVIRONMENT') || 'sandbox'
  
  const baseUrl = environment === 'sandbox' 
    ? 'https://api-sandbox.lawpay.com' 
    : 'https://api.lawpay.com'

  // Import clients first
  const clientsResponse = await fetch(`${baseUrl}/v1/clients`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  
  const clientsData = await clientsResponse.json()
  let importedClients = 0
  let clientErrors = 0

  // Process clients
  for (const lawpayClient of clientsData.data || []) {
    try {
      // Check if client already exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('lawpay_client_id', lawpayClient.id)
        .single()

      if (!existingClient) {
        // Create new client
        const { data: newClient, error } = await supabase
          .from('clients')
          .insert({
            name: lawpayClient.name,
            email: lawpayClient.email,
            phone: lawpayClient.phone,
            lawpay_client_id: lawpayClient.id,
            law_firm: lawpayClient.firm_name || 'VNS Firm',
            created_by: 'lawpay_import',
            location: determineLocationFromClient(lawpayClient)
          })
          .select()
          .single()

        if (error) throw error

        // Create platform mapping
        await supabase.from('platform_client_mapping').insert({
          client_id: newClient.id,
          platform: 'lawpay',
          external_id: lawpayClient.id,
          location: newClient.location,
          metadata: { import_source: 'lawpay_api' }
        })

        importedClients++
      }
    } catch (error) {
      console.error(`Error importing client ${lawpayClient.id}:`, error)
      clientErrors++
    }
  }

  // Import transactions
  const transactionsResponse = await fetch(`${baseUrl}/v1/transactions`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  
  const transactionsData = await transactionsResponse.json()
  let importedTransactions = 0
  let transactionErrors = 0

  for (const transaction of transactionsData.data || []) {
    try {
      // Find client by LawPay client ID
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('lawpay_client_id', transaction.client_id)
        .single()

      if (client) {
        const { error } = await supabase
          .from('lawpay_transaction_import')
          .upsert({
            client_id: client.id,
            lawpay_transaction_id: transaction.id,
            lawpay_client_id: transaction.client_id,
            transaction_data: transaction,
            amount: parseFloat(transaction.amount),
            transaction_date: transaction.date,
            transaction_type: transaction.type,
            status: transaction.status,
            payment_method: transaction.method,
            description: transaction.description
          })

        if (error) throw error
        importedTransactions++
      }
    } catch (error) {
      console.error(`Error importing transaction ${transaction.id}:`, error)
      transactionErrors++
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      clients: { imported: importedClients, errors: clientErrors },
      transactions: { imported: importedTransactions, errors: transactionErrors },
      message: `Import complete: ${importedClients} clients, ${importedTransactions} transactions` 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function determineLocationFromClient(client: any): string {
  // Logic to determine location - customize based on your data
  const address = client.address?.toLowerCase() || ''
  const firm = client.firm_name?.toLowerCase() || ''
  
  if (address.includes('orange') || firm.includes('oc')) return 'OC'
  if (address.includes('angeles') || firm.includes('la')) return 'LA'
  if (address.includes('vegas') || address.includes('nevada')) return 'Vegas'
  
  return 'OC' // Default
}