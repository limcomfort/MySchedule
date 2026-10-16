import { View, Text, Pressable } from 'react-native';
import type { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
}

export default function LessonCard({ lesson, onDelete, onToggleDone }: LessonCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-2 shadow-sm">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-base font-semibold text-gray-900 flex-1">
          {lesson.subject}
        </Text>
        <Pressable onPress={() => onDelete(lesson.id)}>
          <Text className="text-red-500 text-xs ml-2">Удалить</Text>
        </Pressable>
      </View>

      <Text className="text-sm text-gray-500 mb-1">
        {lesson.startTime}–{lesson.endTime}
        {lesson.room ? ` · ауд. ${lesson.room}` : ''}
      </Text>

      {lesson.teacher ? (
        <Text className="text-sm text-gray-500 mb-1">{lesson.teacher}</Text>
      ) : null}

      {lesson.task ? (
        <Pressable
          onPress={() => onToggleDone(lesson.id)}
          className="flex-row items-center mt-2"
        >
          <View
            className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
              lesson.taskDone ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}
          >
            {lesson.taskDone && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text
            className={`text-sm flex-1 ${
              lesson.taskDone ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}
          >
            {lesson.task}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
