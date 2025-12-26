import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../slices/authenticationSlice';
import { fetchThrowTypes, fetchLiftTypes, fetchClassTypes, fetchStates } from '../slices/sharedSlice';
import type { AppDispatch } from '../app/store';

function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch user on app initialization to restore session
    dispatch(fetchUser());
    // Fetch shared data (throw types, lift types, class types, states) for use across the app
    dispatch(fetchThrowTypes());
    dispatch(fetchLiftTypes());
    dispatch(fetchClassTypes());
    dispatch(fetchStates());
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default AuthInitializer;

