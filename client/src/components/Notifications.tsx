import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Notifications.css'; // Create this CSS file for styling

interface GoalRequest {
  _id: string;
  goalId: string;
  goalName: string;
  inviterId: string;
  status: 'pending' | 'accepted' | 'denied';
  createdAt: Date;
}

interface NotificationsProps {
  userId: string;
  onRequestsUpdate?: () => void;
}

function Notifications({ userId, onRequestsUpdate }: NotificationsProps) {
  const [requests, setRequests] = useState<GoalRequest[]>([]);
  const [inviterNames, setInviterNames] = useState<{ [key: string]: string }>({});

  // Fetch goal requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/goalRequests/${userId}`);
        setRequests(result.data.requests);
        
        // Fetch inviter names
        const inviterIds = result.data.requests.map((req: GoalRequest) => req.inviterId);
        const uniqueInviterIds = [...new Set(inviterIds)];
        
        const names: { [key: string]: string } = {};
        for (const id of uniqueInviterIds) {
          const userResult = await axios.get(`http://localhost:3001/userById/${id}`);
          names[id as string] = userResult.data.user.username;
        }
        
        setInviterNames(names);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    
    fetchRequests();
    
    // Poll for new requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Handle accepting or denying a request
  const handleResponse = async (requestId: string, status: 'accepted' | 'denied') => {
    try {
      await axios.put(`http://localhost:3001/goalRequest/${requestId}`, { status });
      
      // Update the local state to reflect the change
      setRequests(prevRequests => 
        prevRequests.filter(req => req._id !== requestId)
      );
      
      // Notify parent component that requests have been updated
      if (onRequestsUpdate) {
        onRequestsUpdate();
      }
    } catch (error) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'denying'} request:`, error);
    }
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (requests.length === 0) {
    return <div className="notifications-empty">No pending requests</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Goal Invitations</h2>
      <div className="notifications-list">
        {requests.map(request => (
          <div key={request._id} className="notification-item">
            <div className="notification-content">
              <p>
                <strong>{inviterNames[request.inviterId] || 'Someone'}</strong> invited you to join 
                <strong> {request.goalName}</strong>
              </p>
              <span className="notification-date">{formatDate(request.createdAt)}</span>
            </div>
            <div className="notification-actions">
              <button 
                className="accept-button"
                onClick={() => handleResponse(request._id, 'accepted')}
              >
                Accept
              </button>
              <button 
                className="deny-button"
                onClick={() => handleResponse(request._id, 'denied')}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;