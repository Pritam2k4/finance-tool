
import React, { useState } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Button from './common/Button';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void; // Should not be closable by user action other than successful login
  onAuthenticated: () => void;
  user: User;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated, user }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // WARNING: Insecure plain text password check. For demo only.
    if (password === user.passwordPlain) {
      onAuthenticated();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Unlock ${user.name}'s Dashboard`}>
      <form onSubmit={handleLogin} className="space-y-6">
        <p className="text-center text-text-muted-light dark:text-text-muted-dark">
          Enter the password to access <span className="font-semibold font-zen-dots text-primary dark:text-primary-light">{user.name}</span>'s realm.
        </p>
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          placeholder="Enter your secret code"
          required
        />
        <Button type="submit" className="w-full" variant="primary">
          Enter Realm
        </Button>
      </form>
    </Modal>
  );
};

export default AuthModal;
