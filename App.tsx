import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import {
  loadLessons,
  deleteLesson,
  toggleTaskDone,
} from './src/store/lessonsSlice';
import ScheduleScreen from './src/screens/ScheduleScreen';
import {
  requestNotificationPermission,
  createNotificationChannel,
} from './src/notifications';

function AppContent() {
  const dispatch = useAppDispatch();
  const lessons = useAppSelector(state => state.lessons.items);

  useEffect(() => {
    async function init() {
      await requestNotificationPermission();
      await createNotificationChannel();
      dispatch(loadLessons());
    }
    init();
  }, [dispatch]);

  return (
    <ScheduleScreen
      lessons={lessons}
      onDelete={id => dispatch(deleteLesson(id))}
      onToggleDone={id => dispatch(toggleTaskDone(id))}
    />
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
