// questionBank.ts — 人教版小学数学各年级运算配置（1-3年级）
// 按皇上确认的课纲编写

export type Operation = '+' | '-' | '×' | '÷'

export type GradeSemester = '1上' | '1下' | '2上' | '2下' | '3上' | '3下'

export type QuestionType = 'dice' | 'cell'

export interface DiceTopic {
  ops: Operation[]
  a: [min: number, max: number]
  b?: [min: number, max: number]
  maxResult?: number
  minResult?: number
  decimals?: boolean
}

export interface GradeConfig {
  name: string
  semester: '上' | '下'
  ops: Operation[]
  bank: DiceTopic[]
  examples: string[]
}

export const QUESTION_BANK: Record<GradeSemester, GradeConfig> = {
  '1上': {
    name: '1年级', semester: '上', ops: ['+', '-'],
    bank: [
      { a: [1, 5], ops: ['+'], maxResult: 10 },
      { a: [1, 10], ops: ['+'], maxResult: 10 },
      { a: [2, 10], ops: ['-'], minResult: 1, maxResult: 9 },
    ],
    examples: ['3 + 4 = ?', '7 - 2 = ?', '5 + 5 = ?'],
  },
  '1下': {
    name: '1年级', semester: '下', ops: ['+', '-'],
    bank: [
      { a: [9, 10], ops: ['+'], b: [1, 9], maxResult: 18 },
      { a: [11, 20], ops: ['-'], b: [1, 9], minResult: 1, maxResult: 18 },
      { a: [1, 10], ops: ['+', '-'], maxResult: 20 },
    ],
    examples: ['9 + 7 = ?', '15 - 8 = ?', '6 + 5 - 3 = ?'],
  },
  '2上': {
    name: '2年级', semester: '上', ops: ['+', '-', '×'],
    bank: [
      { a: [20, 99], ops: ['+'], b: [10, 99], maxResult: 198 },
      { a: [30, 99], ops: ['-'], b: [10, 89], minResult: 1 },
      { a: [2, 5], ops: ['×'], b: [1, 9], maxResult: 45 },
    ],
    examples: ['45 + 37 = ?', '82 - 28 = ?', '4 × 7 = ?'],
  },
  '2下': {
    name: '2年级', semester: '下', ops: ['+', '-', '×', '÷'],
    bank: [
      { a: [6, 9], ops: ['×'], b: [1, 9], maxResult: 81 },
      { a: [1, 9], ops: ['÷'], b: [1, 9] },
      { a: [20, 99], ops: ['+', '-'] },
    ],
    examples: ['7 × 8 = ?', '56 ÷ 7 = ?', '63 - 27 = ?'],
  },
  '3上': {
    name: '3年级', semester: '上', ops: ['+', '-', '×', '÷'],
    bank: [
      { a: [100, 9999], ops: ['+'], maxResult: 19998 },
      { a: [100, 9999], ops: ['-'], minResult: 1 },
      { a: [2, 9], ops: ['×'], b: [10, 99], maxResult: 891 },
      { a: [10, 90], ops: ['÷'], b: [2, 9] },
    ],
    examples: ['3000 + 1500 = ?', '368 + 475 = ?', '84 ÷ 7 = ?'],
  },
  '3下': {
    name: '3年级', semester: '下', ops: ['+', '-', '×', '÷'],
    bank: [
      { a: [100, 999], ops: ['+'], maxResult: 1998 },
      { a: [100, 999], ops: ['-'], minResult: 1 },
      { a: [10, 99], ops: ['+', '-'], maxResult: 200 },
      { a: [2, 9], ops: ['×'], b: [10, 99], maxResult: 891 },
      { a: [20, 90], ops: ['÷'], b: [2, 9] },
    ],
    examples: ['125 + 87 = ?', '300 - 156 = ?', '48 ÷ 6 = ?'],
  },
}

export const GRADE_LIST: GradeSemester[] = ['1上', '1下', '2上', '2下', '3上', '3下']

export const GRADE_DISPLAY: Record<GradeSemester, string> = {
  '1上': '1年级·上', '1下': '1年级·下',
  '2上': '2年级·上', '2下': '2年级·下',
  '3上': '3年级·上', '3下': '3年级·下',
}
