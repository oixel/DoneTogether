import '../styles/Notifications.css';

import Notification from './Notification';


// Define interface for User objects in MongoDB
interface UserObject {
  userId: string;
  joined: boolean;
  completed: boolean;
}

// Define interface for Goal objects in MongoDB
interface GoalData {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  users: Array<UserObject>;
}

function NotificationsList({ userId, invitations }: { userId: string, invitations: Array<GoalData> }) {
  if (invitations.length === 0) {
    return <div className="notifications-empty">No pending invitations...</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Goal Invitations</h2>
      <div className="notifications-list">
        {invitations.map(invitation => (
          <Notification
            key={invitation._id}
            userId={userId}
            invitation={invitation}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationsList;