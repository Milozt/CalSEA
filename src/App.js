import React, { useState, useEffect } from 'react';
import './index.css';
import { sendEmergencySMS } from './services/sms'; // Import the function

function App() {
  const [input, setInput] = useState('');
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [contacts, setContacts] = useState([
    { name: '', number: '', message: '' },
    { name: '', number: '', message: '' },
    { name: '', number: '', message: '' },
  ]);

  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleClick = (value) => {
    const newInput = input + value;

    // Secret emergency code
    if (newInput.endsWith('0000')) {
      setEmergencyTriggered(true);
      alert('🚨 Emergency Mode Activated!');
    }

    setInput(newInput);
  };

  const handleClear = () => {
    setInput('');
    setEmergencyTriggered(false);
  };

  const handleEqual = () => {
    try {
      // Eval calculates the result of input string
      const result = eval(input); // Note: safe here because input only comes from buttons
      setInput(result.toString());
    } catch {
      setInput('Error');
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const handleSendMessage = (contact) => {
    sendEmergencySMS(contact.number, contact.message)
      .then((res) => {
        if (res.success) {
          alert(`SMS sent successfully to ${contact.name}! 📤`);
        } else {
          alert(`Failed to send SMS to ${contact.name}: ${res.error}`);
        }
      })
      .catch((error) => {
        alert(`An unexpected error occurred: ${error.message}`);
      });
  };

  return (
    <div className="app">
      <div className="calculator fullscreen">
        <div className="display">{input || '0'}</div>

        <div className="buttons">
          {[7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+'].map((btn, index) => (
            <button
              key={index}
              onClick={() =>
                btn === '=' ? handleEqual() : handleClick(btn.toString())
              }
            >
              {btn}
            </button>
          ))}
          <button onClick={handleClear}>C</button>
        </div>

        {emergencyTriggered && (
          <div className="emergency-panel">
            <h3>Emergency Contacts</h3>
            {contacts.map((contact, i) => (
              <div key={i} className="contact-box">
                <input
                  type="text"
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => handleContactChange(i, 'name', e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contact.number}
                  onChange={(e) => handleContactChange(i, 'number', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Message"
                  value={contact.message}
                  onChange={(e) => handleContactChange(i, 'message', e.target.value)}
                />
                <button onClick={() => handleSendMessage(contact)}>
                  Send Message
                </button>
              </div>
            ))}
            <button className="police-btn" onClick={() => alert('Calling Kenya Police... 📞')}>
              🚓 Call Police
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
