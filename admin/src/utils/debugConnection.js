// Debug connection utility
export const debugConnection = () => {
  console.log('=== DEBUG CONNECTION ===');
  console.log('Environment variables:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
  
  console.log('\nTesting fetch directly...');
  return fetch('http://localhost:5000/health')
    .then(response => {
      console.log('Fetch response status:', response.status);
      console.log('Fetch response ok:', response.ok);
      return response.json();
    })
    .then(data => {
      console.log('Fetch response data:', data);
      return { success: true, data };
    })
    .catch(error => {
      console.error('Fetch error:', error);
      return { success: false, error: error.message };
    });
};

// Test with different URLs
export const testMultipleUrls = async () => {
  const urls = [
    'http://localhost:5000/health',
    'http://127.0.0.1:5000/health',
    'http://0.0.0.0:5000/health'
  ];
  
  for (const url of urls) {
    try {
      console.log(`Testing ${url}...`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`✅ ${url} - Success:`, data);
      return { success: true, url, data };
    } catch (error) {
      console.log(`❌ ${url} - Failed:`, error.message);
    }
  }
  
  return { success: false, error: 'All URLs failed' };
};
