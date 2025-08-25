import  { useCallback, useState } from 'react';
import axios from 'axios';

function EmailModal({ setModalOpen, inviteLink }: any) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (trimmedEmail && !emails.includes(trimmedEmail)) {
      setEmails((prev) => [...prev, trimmedEmail]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleSend = useCallback(async () => {
    try {
      let sender = 'we-chat'
      const object = {
        sender,
        emails,
        inviteLink,
      };
      console.log('The emails and link is: ', emails, inviteLink);
      await axios.post('http://localhost:3000/send-mail', object);
      alert("Invites sent!");
      setModalOpen(false);
    } catch (error) {
      console.log('There was an error in sending the mail', error);
    }
  }, [emails, inviteLink]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-gray-900">
  
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Share Meeting Link</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Meeting Link</label>
          <input
            type="text"
            readOnly
            value={inviteLink || ''}
            className="w-full p-2 border rounded bg-gray-100 text-gray-800"
          />
        </div>

        {/* Email Input */}
        <div className="mb-2 flex gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter email"
          />
          <button
            onClick={handleAddEmail}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {/* List of Added Emails */}
        {emails.length > 0 && (
          <ul className="mb-4 text-sm">
            {emails.map((email) => (
              <li
                key={email}
                className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded mb-1"
              >
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={emails.length === 0}
          className={`w-full text-white font-semibold py-2 px-4 rounded transition ${
            emails.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}

export default EmailModal;
