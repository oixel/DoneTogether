import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import '../styles/CustomProfileButton.css';

const CustomProfileButton: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user?.firstName) {
      return user.firstName[0];
    } else if (user?.username) {
      return user.username[0];
    }
    return '?';
  };
  
  const handleSignOut = () => {
    signOut();
    // Redirect to homepage or login page after sign out
    // window.location.href = '/';
  };
  
  return (
    <div className="custom-profile" ref={menuRef}>
      <button onClick={toggleMenu} className="profile-button">
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={user.firstName || 'Profile'} 
            className="profile-image"
          />
        ) : (
          <div className="profile-placeholder">
            {getUserInitials()}
          </div>
        )}
      </button>
      
      {isMenuOpen && (
        <div className="profile-menu">
          <div className="menu-header">
            <div className="menu-user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-email">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
          </div>
          <div className="menu-divider"></div>
          <div className="menu-items">
            <a href="/profile" className="menu-item">
              Profile Settings
            </a>
            <a href="/goals" className="menu-item">
              My Goals
            </a>
            <button onClick={handleSignOut} className="menu-item sign-out">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomProfileButton;