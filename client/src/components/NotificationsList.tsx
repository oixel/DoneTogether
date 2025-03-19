import '../styles/Notifications.css';

import Notification from './Notification';

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

// Define types of NotificationList component's props
interface NotificationListPropTypes {
  userId: string;
  invitations: Array<GoalData>;
  setNeedRefresh: CallableFunction;
};

function NotificationsList({ userId, invitations, setNeedRefresh }: NotificationListPropTypes) {
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
            setNeedRefresh={setNeedRefresh}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationsList;