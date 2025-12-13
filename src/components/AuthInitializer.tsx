import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../slices/authenticationSlice';
import type { AppDispatch } from '../app/store';

function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch user on app initialization to restore session
    dispatch(fetchUser());
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default AuthInitializer;

