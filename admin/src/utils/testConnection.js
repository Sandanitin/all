// Test API connection with retry logic
export const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Testing API connection... (attempt ${i + 1}/${retries})`);
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Health Check:', data);
      return { success: true, data };
    } catch (error) {
      console.error(`API Connection Test Failed (attempt ${i + 1}):`, error);
      if (i === retries - 1) {
        return { success: false, error: error.message };
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Test login API directly
export const testLogin = async (credentials) => {
  try {
    console.log('Testing login API directly...');
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Direct Login Response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Direct Login Test Failed:', error);
    return { success: false, error: error.message };
  }
};
