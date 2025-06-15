import React, { useState } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Button from './common/Button';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  user: User;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated, user }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // WARNING: Insecure plain text password check. For demo only.
    if (password === user.passwordPlain) {
      onAuthenticated();
      setPassword(''); // Clear password on success
    } else {
      setError('Incorrect password. Please try again.');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Unlock ${user.name}'s Dashboard`}>
      <form onSubmit={handleLogin} className="space-y-6">
        <p className="text-center text-text-muted-light dark:text-text-muted-dark">
          Enter the password to access <span className="font-semibold font-zen-dots text-primary dark:text-primary-light">{user.name}</span>'s realm.
        </p>
        <p className="text-center text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          Demo Password: <code className="font-mono font-bold">{user.passwordPlain}</code>
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
          autoFocus
        />
        <Button 
          type="submit" 
          className="w-full" 
          variant="primary"
          isLoading={isLoading}
          disabled={!password.trim()}
        >
          {isLoading ? 'Entering...' : 'Enter Realm'}
        </Button>
      </form>
    </Modal>
  );
};

export default AuthModal;