export const environment = {
  production: false,
  // Use ONE of these (match your API console output: "Now listening on:")
  // apiBaseUrl: 'http://localhost:5128/api',   // Kestrel HTTP
  apiBaseUrl: 'https://localhost:7139/api',     // Kestrel HTTPS
  // apiBaseUrl: 'http://localhost:37208/api',  // IIS Express HTTP
  // apiBaseUrl: 'https://localhost:44366/api', // IIS Express HTTPS
};