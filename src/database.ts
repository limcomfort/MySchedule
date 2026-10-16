import SQLite from 'react-native-sqlite-storage';
import type { Lesson, DayOfWeek } from './types';

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabase({
      name: 'schedule.db',
      location: 'default',
    });

    await dbInstance.executeSql(`
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY NOT NULL,
        subject TEXT NOT NULL,
        teacher TEXT,
        room TEXT,
        day TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        task TEXT,
        taskDone INTEGER NOT NULL DEFAULT 0
      );
    `);
  }
  return dbInstance;
}

export async function getAllLessons(): Promise<Lesson[]> {
  const db = await getDb();
  const [results] = await db.executeSql('SELECT * FROM lessons');
  const items: Lesson[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push({
      id: row.id,
      subject: row.subject,
      teacher: row.teacher ?? '',
      room: row.room ?? '',
      day: row.day as DayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      task: row.task ?? '',
      taskDone: row.taskDone === 1,
    });
  }
  return items;
}

export async function insertLesson(lesson: Lesson): Promise<void> {
  const db = await getDb();
  await db.executeSql(
    `INSERT INTO lessons (id, subject, teacher, room, day, startTime, endTime, task, taskDone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lesson.id,
      lesson.subject,
      lesson.teacher,
      lesson.room,
      lesson.day,
      lesson.startTime,
      lesson.endTime,
      lesson.task,
      lesson.taskDone ? 1 : 0,
    ]
  );
}

export async function updateLesson(lesson: Lesson): Promise<void> {
  const db = await getDb();
  await db.executeSql(
    `UPDATE lessons SET subject = ?, teacher = ?, room = ?, day = ?,
     startTime = ?, endTime = ?, task = ?, taskDone = ? WHERE id = ?`,
    [
      lesson.subject,
      lesson.teacher,
      lesson.room,
      lesson.day,
      lesson.startTime,
      lesson.endTime,
      lesson.task,
      lesson.taskDone ? 1 : 0,
      lesson.id,
    ]
  );
}

export async function deleteLesson(id: string): Promise<void> {
  const db = await getDb();
  await db.executeSql('DELETE FROM lessons WHERE id = ?', [id]);
}
