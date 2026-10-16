import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { addLesson, updateLesson } from '../store/lessonsSlice';
import { DAYS, type Lesson } from '../types';
import { scheduleLessonReminder } from '../notifications';

interface LessonFormProps {
  visible: boolean;
  editingLesson: Lesson | null;
  onClose: () => void;
}

function emptyLesson(): Lesson {
  return {
    id: String(Date.now()),
    subject: '',
    teacher: '',
    room: '',
    day: 'monday',
    startTime: '09:00',
    endTime: '10:30',
    task: '',
    taskDone: false,
  };
}

export default function LessonForm({ visible, editingLesson, onClose }: LessonFormProps) {
  const dispatch = useAppDispatch();
  const [lesson, setLesson] = useState<Lesson>(editingLesson ?? emptyLesson());

  async function handleSubmit() {
    if (!lesson.subject.trim()) return;

    if (editingLesson) {
      await dispatch(updateLesson(lesson));
    } else {
      await dispatch(addLesson(lesson));
      const dayIndex = DAYS.findIndex((d) => d.key === lesson.day) + 1;
      await scheduleLessonReminder(lesson.subject, dayIndex, lesson.startTime);
    }

    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5">
          <Text className="text-lg font-bold mb-4">
            {editingLesson ? 'Редактировать' : 'Новое занятие'}
          </Text>

          <TextInput
            className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
            placeholder="Предмет"
            value={lesson.subject}
            onChangeText={(text) => setLesson({ ...lesson, subject: text })}
          />
          <TextInput
            className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
            placeholder="Преподаватель"
            value={lesson.teacher}
            onChangeText={(text) => setLesson({ ...lesson, teacher: text })}
          />
          <TextInput
            className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
            placeholder="Аудитория"
            value={lesson.room}
            onChangeText={(text) => setLesson({ ...lesson, room: text })}
          />

          <View className="flex-row gap-2 mb-2">
            <TextInput
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
              placeholder="09:00"
              value={lesson.startTime}
              onChangeText={(text) => setLesson({ ...lesson, startTime: text })}
            />
            <TextInput
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
              placeholder="10:30"
              value={lesson.endTime}
              onChangeText={(text) => setLesson({ ...lesson, endTime: text })}
            />
          </View>

          <View className="flex-row flex-wrap gap-2 mb-3">
            {DAYS.map((d) => (
              <Pressable
                key={d.key}
                onPress={() => setLesson({ ...lesson, day: d.key })}
                className={`px-3 py-1 rounded ${
                  lesson.day === d.key ? 'bg-blue-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={
                    lesson.day === d.key ? 'text-white text-xs' : 'text-gray-700 text-xs'
                  }
                >
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
            placeholder="Задание"
            value={lesson.task}
            onChangeText={(text) => setLesson({ ...lesson, task: text })}
          />

          <View className="flex-row gap-2">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
            >
              <Text className="font-medium">Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-blue-600 items-center"
            >
              <Text className="text-white font-medium">Сохранить</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
