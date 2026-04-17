// src/utils/getGreeting.ts
// ─────────────────────────────────────────────────────────────
// Utility: dynamic, variation-rich greeting system
// Touch NOTHING else in the codebase — this is fully self-contained
// ─────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Returns a full greeting string (with emoji) based on local time + name.
 * Stable per-mount — call once inside useState(() => getGreeting(name)).
 */
export function getGreeting(name?: string): string {
  const hour = new Date().getHours()
  const n = name ? `, ${name}` : ''

  // 🌅 Morning: 5 AM – 12 PM
  if (hour >= 5 && hour < 12) {
    return pickRandom([
      `Good morning${n} 🌅`,
      `Rise and shine${n} ☀️`,
      `Ready to study${n}? 📚`,
      `Let's make progress today${n} 💪`,
      `Morning, ${name ?? 'there'} — let's get it 🔥`,
    ])
  }

  // ☀️ Afternoon: 12 PM – 5 PM
  if (hour >= 12 && hour < 17) {
    return pickRandom([
      `Good afternoon${n} ☀️`,
      `How's your day going${n}? 😊`,
      `Back again${n} — let's continue 🔥`,
      `Afternoon grind${n} 💡`,
      `Consistency wins${n} 🏆`,
    ])
  }

  // 🌆 Evening: 5 PM – 9 PM
  if (hour >= 17 && hour < 21) {
    return pickRandom([
      `Good evening${n} 🌆`,
      `Evening study session${n}? 📖`,
      `Wrapping the day strong${n} ⚡`,
      `Let's make tonight count${n} 🎯`,
      `One more session${n}? Let's go 🚀`,
    ])
  }

  // 🌙 Night: 9 PM – 5 AM
  return pickRandom([
    `Still studying${n}? 🌙`,
    `Burning the midnight oil${n} 🕯️`,
    `Late-night grind${n} — respect 💫`,
    `Dedication level: max${n} 🌙`,
    `Night owl mode${n} 🦉`,
  ])
}

/**
 * Returns context-aware subtext below the greeting.
 *
 * @param cardsDue  - number of cards due today (from stats)
 * @param isNewUser - true when user has 0 total cards AND 0 total decks
 */
export function getSubtext(cardsDue?: number, isNewUser?: boolean): string {
  if (isNewUser) {
    return "Let's create your first deck and start your streak. 🚀"
  }
  if (!cardsDue || cardsDue === 0) {
    return "You're all caught up — great work! ✅"
  }
  return `You have ${cardsDue} card${cardsDue !== 1 ? 's' : ''} due for review today.`
}
