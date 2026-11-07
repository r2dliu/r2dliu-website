// Interface text for the flashcards page in English and Chinese. Chinese
// mode also swaps definitions for Chinese ones (see `useDefinition`).
import { useStudyStore } from '../../stores/chinese/studyStore'
import type { Language } from '../../stores/chinese/studyStore'

const STRINGS = {
  // Study screen
  settings: ['Settings', '设置'],
  meaning: ['Meaning', '释义'],
  draw: ['Draw', '书写'],
  related: ['Related', '相关'],
  examples: ['Examples', '例句'],
  examplesSource: [
    'Example sentences from Tatoeba (CC BY 2.0 FR)',
    '例句来自 Tatoeba（CC BY 2.0 FR）',
  ],
  showTranslation: [
    'Tap a sentence for its translation',
    '点击句子显示英文翻译',
  ],
  showAnswer: ['Show answer', '显示答案'],
  AGAIN: ['Again', '重来'],
  HARD: ['Hard', '困难'],
  GOOD: ['Good', '良好'],
  EASY: ['Easy', '简单'],
  KNOWN: ['Known', '已掌握'],
  never: ['never', '不再'],
  state_NEW: ['new', '新卡'],
  state_LEARNING: ['learning', '学习中'],
  state_REVIEW: ['review', '复习'],
  state_RELEARNING: ['relearning', '重学'],
  state_KNOWN: ['known', '已掌握'],
  state_UPCOMING: ['not in deck yet', '未加入'],
  lapses: ['{n} lapses', '遗忘 {n} 次'],
  countNew: ['New cards left today', '今天剩余新卡'],
  countLearning: ['Learning', '学习中'],
  countReview: ['Reviews due', '待复习'],
  doneForNow: ['Done for now 🎉', '暂时完成 🎉'],
  nextDue: ['Next card is due {when}.', '下一张卡片：{when}。'],
  noneScheduled: ['No cards are scheduled.', '没有待学的卡片。'],
  limitReached: [' New card limit reached for today.', ' 今天的新卡已学完。'],
  keepGoing: ['Keep going (+10 new cards)', '继续学习（+10 张新卡）'],
  checkAgain: ['Check again', '刷新'],
  traditional: ['Traditional: {t}', '繁体：{t}'],
  mostCommon: ['#{n} most common', '常用第 {n}'],
  more: ['More', '展开'],
  less: ['Less', '收起'],

  // Remediation
  missed: [
    'Missed {hanzi} — finish these before moving on',
    '{hanzi} 答错了——完成以下任务再继续',
  ],
  allDone: [
    'All done — explore as long as you like, then Next',
    '全部完成——可以继续探索，然后点“下一个”',
  ],
  next: ['Next', '下一个'],
  DRAW_STROKES: ['Draw the character', '书写汉字'],
  EXPLORE_RELATED: ['Explore related vocab', '探索相关词汇'],
  TYPE_PINYIN: ['Type the pinyin', '输入拼音'],
  drawHintFree: [
    'Draw the whole character, then Check. {n}% accuracy counts.',
    '写出整个字，然后检查。准确率达到 {n}% 即计入。',
  ],
  drawHintTrace: [
    'Draw each stroke in order on the grid.',
    '在格子里按笔顺书写每一笔。',
  ],
  noOutline: [' No outline — from memory!', ' 没有轮廓——凭记忆书写！'],
  counted: ['Counted ✓', '已计入 ✓'],
  needsAccuracy: [
    'Needs {n}% to count — draw it again',
    '需要 {n}% 才算——再写一次',
  ],
  mistakesAllowed: ['Mistakes: {m} / {max} allowed', '错误：{m} / 最多 {max}'],
  tracedOk: [
    'Nice — {c} drawn with {m} mistakes.',
    '很好——{c} 写完，错误 {m} 次。',
  ],
  tracedBad: [
    '{m} mistakes (max {max}). Try {c} again.',
    '错误 {m} 次（最多 {max}）。再写一次 {c}。',
  ],
  showCardAgain: ['Show the card again', '再看一遍卡片'],
  exploreHint: [
    'Open at least {n} of these — they share characters with the card. Opened {d} / {n}.',
    '至少打开 {n} 个——它们和这张卡片有相同的字。已打开 {d} / {n}。',
  ],
  pinyinLabel: [
    'Pinyin with tones (ni3hao3 or nǐhǎo)',
    '带声调的拼音（ni3hao3 或 nǐhǎo）',
  ],
  correct: ['Correct!', '正确！'],
  notQuite: [
    "Not quite — it's {x}. Type it again.",
    '不对——应该是 {x}。再输入一次。',
  ],
  correctCount: ['Correct {d} / {n}', '正确 {d} / {n}'],
  attempts: [' · {n} attempts', ' · 尝试 {n} 次'],

  // Drawing
  freeDraw: ['Free draw', '自由书写'],
  guided: ['Guided', '描写'],
  check: ['Check', '检查'],
  checking: ['Checking…', '检查中…'],
  undo: ['Undo', '撤销'],
  clear: ['Clear', '清除'],
  showStrokes: ['Show strokes', '显示笔顺'],
  backToDrawing: ['Back to drawing', '返回书写'],
  startOver: ['Start over', '重新开始'],
  drawAgain: ['Draw again', '再写一次'],
  strokesLine: [
    'Strokes {s}/{e} · Order {o}/{e} · Direction {d}/{e}',
    '笔画 {s}/{e} · 顺序 {o}/{e} · 方向 {d}/{e}',
  ],
  recognised: ['Recognised as {h} ✓', '识别为 {h} ✓'],
  looksLike: ['Looks more like', '更像'],
  also: [' · also {list}', ' · 其他：{list}'],
  guidedDone: ['Done with {m} mistakes.', '完成，错误 {m} 次。'],
  mistakes: ['Mistakes: {m}', '错误：{m}'],
  noStrokeData: ['No stroke data for this card.', '这张卡片没有笔画数据。'],

  // Related
  noRelated: ['No related vocab found.', '没有找到相关词汇。'],
  alsoIn: ['Also in: ', '其他词语：'],
  addToDeck: ['Add to deck', '加入卡组'],
  addedToDeck: ['Added to deck', '已加入'],

  // Deck browser
  editDeck: ['Edit deck', '编辑卡组'],
  back: ['Back', '返回'],
  search: ['Search hanzi, pinyin or meaning', '搜索汉字、拼音或释义'],
  filter_ALL: ['All', '全部'],
  filter_NEW: ['New', '新卡'],
  filter_LEARNING: ['Learning', '学习中'],
  filter_REVIEW: ['Review', '复习'],
  filter_KNOWN: ['Known', '已掌握'],
  filter_UPCOMING: ['Upcoming', '待加入'],
  itemCount: ['{n} cards', '{n} 张卡片'],
  upcomingCount: [
    '{n} not in the deck yet, most common first',
    '{n} 个尚未加入，按常用程度排序',
  ],
  noItems: ['Nothing here.', '没有内容。'],
  loadMore: ['Load more', '加载更多'],
  dueNow: ['due now', '现在到期'],
  dueIn: ['due in {d}', '{d}后到期'],
  studyNow: ['Study now', '现在学习'],
  markKnown: ['Mark known', '标记为已掌握'],
  resetCard: ['Reset to new', '重置为新卡'],
  learnNext: ['Learn next', '下一个学习'],
  prev: ['Previous', '上一个'],
  done: ['Done', '完成'],
  queuedNow: [
    "Queued — it'll come up when you study.",
    '已加入学习队列，学习时会出现。',
  ],

  // Settings and decks
  language: ['Language', '语言'],
  deck: ['Deck', '卡组'],
  newDeck: ['New deck', '新卡组'],
  cancel: ['Cancel', '取消'],
  save: ['Save', '保存'],
  deckName: ['Deck name', '卡组名称'],
  cards: ['Cards', '卡片'],
  cardsCharacter: ['Characters (字)', '汉字（字）'],
  cardsWord: ['Vocab words (词)', '词语（词）'],
  createDeck: ['Create deck', '创建卡组'],
  intro: [
    'Cards are introduced from most to least common (SUBTLEX-CH frequency). Failing a card can require extra work before you move on — configure it in the deck settings.',
    '卡片按使用频率从高到低出现（SUBTLEX-CH）。答错时可以要求先完成额外的任务再继续——在卡组设置里配置。',
  ],
  newPerDay: ['New cards / day', '每天新卡'],
  learningSteps: ['Learning steps (minutes)', '学习间隔（分钟）'],
  relearnDelay: ['Failed review returns in (min)', '复习答错后重现（分钟）'],
  whenAgain: ['When I press “Again”…', '当我点“重来”时…'],
  whenAgainHint: [
    'These tasks run in order and must all be finished before the next card. Leave empty for plain Anki behaviour.',
    '这些任务按顺序进行，全部完成后才能看下一张卡片。留空则和普通 Anki 一样。',
  ],
  noTasks: [
    'No tasks — the card just goes back in the queue.',
    '没有任务——卡片直接回到队列。',
  ],
  remove: ['Remove', '删除'],
  deleteDeck: ['Delete deck', '删除卡组'],
  confirmDelete: [
    'Delete “{name}” and its progress?',
    '删除“{name}”及其学习进度？',
  ],
  opt_repetitions: ['Times required', '需要次数'],
  opt_showOutline: ['Show outline (guided)', '显示轮廓（描写）'],
  opt_characters: ['Characters to draw', '要写的字'],
  opt_mode: ['Drawing', '书写方式'],
  opt_minAccuracy: ['Min accuracy (%), free draw', '最低准确率（%，自由书写）'],
  opt_maxMistakes: ['Max mistakes, guided', '最多错误（描写）'],
  opt_minOpened: ['Must open at least', '至少打开'],
  opt_maxItems: ['Items in list', '列表数量'],
  choice_ALL: ['All in the card', '卡片里的所有字'],
  choice_FIRST: ['Just the first', '只写第一个'],
  choice_FREE: ['Free draw', '自由书写'],
  choice_TRACE: ['Guided (stroke by stroke)', '描写（逐笔）'],
} satisfies Record<string, [string, string]>

export type StringKey = keyof typeof STRINGS

export function translate(
  language: Language,
  key: StringKey,
  vars: Record<string, string | number> = {},
): string {
  const pair = STRINGS[key] as [string, string] | undefined
  if (!pair) return '' // unknown key, e.g. an option added on the server
  const text = pair[language === 'zh' ? 1 : 0]
  return text.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : '',
  )
}

/** `t(key, vars)` in the chosen language */
export function useT() {
  const language = useStudyStore((s) => s.language)
  return (key: StringKey, vars?: Record<string, string | number>) =>
    translate(language, key, vars)
}

/** The definition to show: Chinese when chosen and available */
export function useDefinition() {
  const language = useStudyStore((s) => s.language)
  return (item: { definition: string; definitionZh?: string | null }) =>
    language === 'zh' && item.definitionZh ? item.definitionZh : item.definition
}
