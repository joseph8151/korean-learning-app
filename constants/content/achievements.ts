import type { Achievement } from '@/types/user';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Lesson', description: 'Finish your very first lesson.', emoji: '🎯' },
  { id: 'streak_3', title: '3 Day Streak', description: 'Study three days in a row.', emoji: '🔥' },
  { id: 'streak_7', title: '7 Day Streak', description: 'A full week of Korean.', emoji: '🏆' },
  { id: 'words_50', title: '50 Words', description: 'Learn fifty Korean words.', emoji: '📚' },
  { id: 'words_100', title: '100 Words', description: 'Learn one hundred Korean words.', emoji: '💎' },
  { id: 'first_conversation', title: 'First Conversation', description: 'Complete an AI Korean conversation.', emoji: '💬' },
  { id: 'perfect_quiz', title: 'Perfect Quiz', description: 'Score 100% on a lesson quiz.', emoji: '⭐' },
  { id: 'hangul_master', title: 'Hangul Master', description: 'Finish both Hangul lessons.', emoji: '🇰🇷' },
];
