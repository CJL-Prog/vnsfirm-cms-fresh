// Create src/utils/apiUtils.js
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If this is network-related error, retry
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        continue;
      }
      
      // For other errors, don't retry
      throw error;
    }
  }
  
  throw lastError;
};

// Usage in API services:
export const getClientById = async (id) => {
  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    });
  } catch (error) {
    throw handleError(error, `Error fetching client with ID ${id}`);
  }
};