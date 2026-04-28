/* ============================================
   SpineUp — Mock Data
   ============================================ */
const MOCK_DATA = {
  user: {
    name: "Arjun",
    email: "arjun@spineup.com",
    level: 12,
    levelName: "Posture Master",
    xp: 1250,
    xpToNext: 2000,
    ht: 1250,
    streak: 5,
    bestStreak: 14,
    dailyGoalHours: 8,
    goodPostureHours: 6,
    currentScore: 85
  },
  device: {
    name: "SpineUp Sensor",
    connected: true,
    battery: 90,
    mode: "private",
    firmware: "v1.2.0"
  },
  weeklyScores: [
    { day: "M", score: 72, date: "May 12", label: "Mon" },
    { day: "T", score: 68, date: "May 13", label: "Tue" },
    { day: "W", score: 85, date: "May 14", label: "Wed" },
    { day: "T", score: 78, date: "May 15", label: "Thu" },
    { day: "F", score: 92, date: "May 16", label: "Fri" },
    { day: "S", score: 80, date: "May 17", label: "Sat" },
    { day: "S", score: 75, date: "May 18", label: "Sun" }
  ],
  dailyScores: [
    { time: "6 AM", score: 70 }, { time: "9 AM", score: 82 },
    { time: "12 PM", score: 88 }, { time: "3 PM", score: 75 },
    { time: "6 PM", score: 85 }, { time: "9 PM", score: 78 },
    { time: "12 AM", score: 65 }
  ],
  streakDays: [
    { day: "M", met: true }, { day: "T", met: true },
    { day: "W", met: true }, { day: "T", met: true },
    { day: "F", met: true }, { day: "S", met: "today" },
    { day: "S", met: false }
  ],
  products: [
    { id: 1, name: "Posture Corrector", price: 750, category: "accessories", locked: false, img: "🦴" },
    { id: 2, name: "Lumbar Support", price: 1000, category: "accessories", locked: false, img: "🪑" },
    { id: 3, name: "Posture Band", price: 500, category: "accessories", locked: true, img: "⌚" },
    { id: 4, name: "Coaching Plan", subtitle: "1 Month", price: 1500, category: "premium", locked: true, img: "📋" }
  ],
  exercises: [
    { id: 1, name: "Neck Stretch", duration: "5 min", level: "Beginner", icon: "🧘" },
    { id: 2, name: "Shoulder Roll", duration: "4 min", level: "Beginner", icon: "💪" },
    { id: 3, name: "Thoracic Extension", duration: "6 min", level: "Intermediate", icon: "🏋️" },
    { id: 4, name: "Back Strengthening", duration: "8 min", level: "Advanced", icon: "🔥" },
    { id: 5, name: "Cat Cow Stretch", duration: "5 min", level: "Beginner", icon: "🐱" }
  ],
  badges: [
    { id: 1, name: "First Step", earned: true, icon: "👣" },
    { id: 2, name: "7 Day Streak", earned: true, icon: "🔥" },
    { id: 3, name: "Perfect Week", earned: true, icon: "⭐" },
    { id: 4, name: "Early Bird", earned: true, icon: "🌅" },
    { id: 5, name: "Consistent", earned: true, icon: "💎" },
    { id: 6, name: "Back in Action", earned: false, icon: "🔙" },
    { id: 7, name: "Coming Soon", earned: false, icon: "🔒" }
  ],
  reminders: [
    { id: "posture", name: "Posture Reminder", desc: "Every 1 hour", icon: "🧍", on: true },
    { id: "exercise", name: "Exercise Reminder", desc: "Daily at 8:00 PM", icon: "🏃", on: true },
    { id: "hydration", name: "Hydration Reminder", desc: "Every 2 hours", icon: "💧", on: false },
    { id: "weekly", name: "Weekly Report", desc: "Every Sunday", icon: "📊", on: true }
  ],
  insights: {
    alignment: 90,
    movement: 80,
    consistency: 85,
    avgScore: 78,
    bestDay: { score: 92, date: "May 16" },
    totalGoodHours: 45,
    improvement: 18,
    aiTip: "Your posture is best between 9-11 AM. Try scheduling important work during those hours for optimal focus."
  },
  htEarningRules: [
    { action: "Daily goal complete", ht: 30 },
    { action: "Score above 85", ht: 20 },
    { action: "7 day streak", ht: 100 },
    { action: "30 day streak", ht: 500 },
    { action: "First time setup", ht: 50 },
    { action: "Refer a friend", ht: 100 }
  ]
};
