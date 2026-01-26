import React, { useEffect, useState } from 'react';
import { baseUrl } from '../app/shared/baseUrl';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePicturePage = () => {
  const [pictureUrl, setPictureUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
    }
  }, [navigate]);

  const updatePicture = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setStatus('Please log in first.');
      return;
    }
    if (!pictureUrl.trim()) {
      setStatus('Please enter a picture URL.');
      return;
    }

    try {
      setIsSaving(true);
      setStatus('Saving picture...');
      const response = await fetch(`${baseUrl}/auth/picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ picture_url: pictureUrl })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update picture');

      localStorage.setItem('authUserPicture', data.user.picture_url || '');
      localStorage.setItem('authUserName', data.user.first_name || 'Player');
      setStatus('Picture updated!');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '1rem' }}>Profile Picture</h2>
      <FormGroup>
        <Label htmlFor='pictureUrl'>Picture URL</Label>
        <Input
          type='text'
          id='pictureUrl'
          placeholder='https://randomuser.me/api/portraits/men/97.jpg'
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button color='secondary' onClick={updatePicture} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Picture'}
        </Button>
        <Button color='link' tag={Link} to="/profile">
          Back to Profile
        </Button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ProfilePicturePage;
