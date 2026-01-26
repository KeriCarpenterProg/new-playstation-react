import React, { useEffect, useState } from 'react';
import { baseUrl } from '../app/shared/baseUrl';
import { Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const cardStyle = {
    maxWidth: 560,
    margin: '2rem auto',
    padding: '1.5rem',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadMe = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to load profile');
        setUser(data.user);
        setStatus('');
      } catch (err) {
        setStatus(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMe();
  }, [navigate]);

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '1rem' }}>Profile</h2>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.first_name || ''} {user.last_name || ''}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.picture_url && (
            <img
              src={user.picture_url}
              alt="Profile"
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
            />
          )}
        </>
      ) : status ? (
        <p className="text-danger">Error loading profile: {status}</p>
      ) : (
        <p>{isLoading ? 'Loading profile...' : 'No profile data loaded.'}</p>
      )}

      <Button color='secondary' tag={Link} to="/profile-picture" disabled={isLoading}>
        Update Profile Picture
      </Button>
      {status && user && <p className="text-danger">{status}</p>}
    </div>
  );
};

export default ProfilePage;
