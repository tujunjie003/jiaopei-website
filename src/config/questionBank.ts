// questionBank.ts — 人教版小学数学各年级运算配置
// 按皇上确认的课纲编写

export type Operation = '+' | '-' | '×' | '÷'

export type GradeSemester = 
  | '1上' | '1下'
  | '2上' | '2下'
  | '3上' | '3下'
  | '4上' | '4下'
  | '5上' | '5下'
  | '6上' | '6下'

/** 题目类型 */
export type QuestionType = 'dice' | 'cell'

/** 骰子题目配置 */
export interface DiceTopic {
  /** 运算类型 */
  ops: Operation[]
  /** 数字1范围 */
  a: [min: number, max: number]
  /** 数字2范围 */
  b?: [min: number, max: number]
  /** 第三个数范围（可选，用于3数运算） */
  c?: [min: number, max: number]
  /** 结果上限 */
  maxResult?: number
  /** 结果下限 */
  minResult?: number
  /** 是否产生小数 */
  decimals?: boolean
  /** 产生分数 */
  fraction?: boolean
  /** 产生百分数 */
  percent?: boolean
}

/** 年级运算配置 */
export interface GradeConfig {
  name: string
  semester: '上' | '下'
  /** 可选运算 */
  ops: Operation[]
  /** 题库配置 */
  bank: DiceTopic[]
  /** 题目示例（用于验证展示） */
  examples: string[]
}

/** 12个年级学期的完整题库配置 */
export const QUESTION_BANK: Record<GradeSemester, GradeConfig> = {
  '1上': {
    name: '1年级',
    semester: '上',
    ops: ['+', '-'],
    bank: [
      { a: [1, 5], ops: ['+'], maxResult: 10 },
      { a: [1, 10], ops: ['+'], maxResult: 10 },
      { a: [2, 10], ops: ['-'], minResult: 1, maxResult: 9 },
    ],
    examples: ['3 + 4 = ?', '7 - 2 = ?', '5 + 5 = ?'],
  },

  '1下': {
    name: '1年级',
    semester: '下',
    ops: ['+', '-'],
    bank: [
      // 20以内进位加法
      { a: [9, 10], ops: ['+'], b: [1, 9], maxResult: 18 },
      // 20以内退位减法
      { a: [11, 20], ops: ['-'], b: [1, 9], minResult: 1, maxResult: 18 },
      // 连加连减
      { a: [1, 10], ops: ['+', '-'], maxResult: 20 },
    ],
    examples: ['9 + 7 = ?', '15 - 8 = ?', '6 + 5 - 3 = ?'],
  },

  '2上': {
    name: '2年级',
    semester: '上',
    ops: ['+', '-', '×'],
    bank: [
      // 100以内加减法
      { a: [20, 99], ops: ['+'], b: [10, 99], maxResult: 198 },
      { a: [30, 99], ops: ['-'], b: [10, 89], minResult: 1 },
      // 2-5乘法口诀
      { a: [2, 5], ops: ['×'], b: [1, 9], maxResult: 45 },
    ],
    examples: ['45 + 37 = ?', '82 - 28 = ?', '4 × 7 = ?'],
  },

  '2下': {
    name: '2年级',
    semester: '下',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 6-9乘法口诀
      { a: [6, 9], ops: ['×'], b: [1, 9], maxResult: 81 },
      // 表内除法（除数×商=被除数，保证整除）
      { a: [1, 9], ops: ['÷'], b: [1, 9] },
      // 加减法保持
      { a: [20, 99], ops: ['+', '-'] },
    ],
    examples: ['7 × 8 = ?', '56 ÷ 7 = ?', '63 - 27 = ?'],
  },

  '3上': {
    name: '3年级',
    semester: '上',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 万以内加减法
      { a: [100, 9999], ops: ['+'], maxResult: 19998 },
      { a: [100, 9999], ops: ['-'], minResult: 1 },
      // 一位数乘除法
      { a: [2, 9], ops: ['×'], b: [10, 99], maxResult: 891 },
      { a: [10, 90], ops: ['÷'], b: [2, 9] },
    ],
    examples: ['3000 + 1500 = ?', '368 + 475 = ?', '84 ÷ 7 = ?'],
  },

  '3下': {
    name: '3年级',
    semester: '下',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 三位数加减法
      { a: [100, 999], ops: ['+'], maxResult: 1998 },
      { a: [100, 999], ops: ['-'], minResult: 1 },
      // 混合运算（同级，从左到右）
      { a: [10, 99], ops: ['+', '-'], maxResult: 200 },
      // 乘法
      { a: [2, 9], ops: ['×'], b: [10, 99], maxResult: 891 },
      // 除法
      { a: [20, 90], ops: ['÷'], b: [2, 9] },
    ],
    examples: ['125 + 87 = ?', '300 - 156 = ?', '48 ÷ 6 = ?'],
  },

  '4上': {
    name: '4年级',
    semester: '上',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 大数加减法
      { a: [1000, 9999], ops: ['+'], maxResult: 19998 },
      { a: [1000, 9999], ops: ['-'], minResult: 1 },
      // 混合运算（含括号）
      { a: [10, 100], ops: ['+', '-', '×', '÷'] },
      // 乘法
      { a: [100, 999], ops: ['×'], b: [10, 99], maxResult: 999 * 99 },
      // 除法
      { a: [100, 999], ops: ['÷'], b: [10, 99] },
    ],
    examples: ['(125 + 87) × 3 = ?', '4500 - 2780 = ?', '864 ÷ 12 = ?'],
  },

  '4下': {
    name: '4年级',
    semester: '下',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 整数四则运算
      { a: [100, 999], ops: ['+', '-', '×', '÷'] },
      // 运算定律（乘法分配率等，通过混合运算体现）
      { a: [10, 99], ops: ['×'], b: [4, 9], maxResult: 891 },
      { a: [100, 999], ops: ['÷'], b: [10, 99] },
    ],
    examples: ['25 × 4 × 2 = ?', '672 ÷ 28 = ?', '375 + 825 = ?'],
  },

  '5上': {
    name: '5年级',
    semester: '上',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 小数加减法
      { a: [1, 99], ops: ['+'], b: [1, 99], decimals: true, maxResult: 200 },
      { a: [1, 99], ops: ['-'], b: [1, 99], decimals: true, minResult: 0 },
      // 小数乘法
      { a: [1, 9], ops: ['×'], b: [10, 99], decimals: true, maxResult: 900 },
    ],
    examples: ['3.7 + 2.5 = ?', '7.2 - 3.8 = ?', '2.5 × 1.2 = ?'],
  },

  '5下': {
    name: '5年级',
    semester: '下',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 小数除法
      { a: [10, 99], ops: ['÷'], b: [10, 99], decimals: true },
      // 分数加减法（同分母）
      { a: [1, 9], ops: ['+', '-'], b: [1, 9] },
      // 小数乘法保持
      { a: [1, 9], ops: ['×'], b: [1, 9], decimals: true },
    ],
    examples: ['4.8 ÷ 6 = ?', '4/5 + 1/5 = ?', '2.3 × 1.5 = ?'],
  },

  '6上': {
    name: '6年级',
    semester: '上',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 分数乘除法
      { a: [1, 9], ops: ['×', '÷'], b: [1, 9], fraction: true },
      // 百分数
      { a: [10, 100], ops: ['×'], b: [1, 100], percent: true, maxResult: 10000 },
      // 混合运算
      { a: [1, 99], ops: ['+', '-', '×', '÷'] },
    ],
    examples: ['3/4 × 2/5 = ?', '75% × 40 = ?', '1/2 ÷ 3/4 = ?'],
  },

  '6下': {
    name: '6年级',
    semester: '下',
    ops: ['+', '-', '×', '÷'],
    bank: [
      // 比和比例
      { a: [1, 9], ops: ['+', '-', '×', '÷'] },
      // 综合运算
      { a: [10, 999], ops: ['+', '-', '×', '÷'] },
    ],
    examples: ['3:5 = 9:?（求比值）', '120 × 30% = ?', '1/4 + 1/3 = ?'],
  },
}

/** 年级学期列表（用于UI选择） */
export const GRADE_LIST: GradeSemester[] = [
  '1上', '1下', '2上', '2下', '3上', '3下',
  '4上', '4下', '5上', '5下', '6上', '6下',
]

/** 年级显示名 */
export const GRADE_DISPLAY: Record<GradeSemester, string> = {
  '1上': '1年级·上', '1下': '1年级·下',
  '2上': '2年级·上', '2下': '2年级·下',
  '3上': '3年级·上', '3下': '3年级·下',
  '4上': '4年级·上', '4下': '4年级·下',
  '5上': '5年级·上', '5下': '5年级·下',
  '6上': '6年级·上', '6下': '6年级·下',
}
