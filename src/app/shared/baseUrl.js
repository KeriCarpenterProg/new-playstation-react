export const baseUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://new-playstation-react.onrender.com/'
  : "http://localhost:3001/";
