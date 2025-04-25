// src/services/sms.js
import axios from 'axios';

export const sendEmergencySMS = async (to, message) => {
  // Add this log to check data before sending
  console.log("Sending SMS with data:", { to, message });

  try {
    // Sending the SMS request to the backend
    const response = await axios.post('http://localhost:5000/send-sms', {
      to,
      message,
    });

    // Log to confirm SMS response
    console.log('✅ SMS Sent:', response.data);
    return response.data;
  } catch (error) {
    // Log the error if the request fails
    console.error('❌ Error sending SMS:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
