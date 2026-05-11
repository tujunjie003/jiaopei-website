// QuestionGenerator.ts — 按年级配置生成随机骰子题
import { GradeSemester, QUESTION_BANK, Operation } from '../config/questionBank'

export interface GeneratedQuestion {
  text: string          // 展示文本，如 "7 + 3 = ?"
  answer: number        // 正确答案
  rawText: string       // 原始表达式
  ops: Operation[]      // 涉及运算
}

/** 随机整数 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 随机选择数组元素 */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 生成符合年级配置的骰子题 */
export function generateDiceQuestion(gradeSemester: GradeSemester): GeneratedQuestion {
  const config = QUESTION_BANK[gradeSemester]
  if (!config) throw new Error(`未知年级: ${gradeSemester}`)

  const topic = pick(config.bank)
  const op = pick(topic.ops)

  // 根据运算类型生成数字
  let a: number, b: number, c: number | undefined
  let answer: number

  const genNumber = (range: [number, number]): number => {
    return randInt(range[0], range[1])
  }

  if (op === '+') {
    a = genNumber(topic.a)
    b = genNumber(topic.b || topic.a)
    if (topic.maxResult !== undefined && a + b > topic.maxResult) {
      a = Math.min(a, topic.maxResult - b)
      if (a < topic.a[0]) a = topic.a[0]
    }
    answer = a + b
    const text = topic.decimals
      ? `${a.toFixed(1)} + ${b.toFixed(1)} = ?`
      : `${a} + ${b} = ?`
    return { text, answer, rawText: `${a}+${b}`, ops: ['+'] }
  }

  if (op === '-') {
    a = genNumber(topic.a)
    b = genNumber(topic.b || topic.a)
    if (topic.minResult !== undefined && a < b) [a, b] = [b, a]
    if (topic.minResult !== undefined && a - b < topic.minResult) a = b + topic.minResult
    if (topic.maxResult !== undefined && a - b > topic.maxResult) a = b + topic.maxResult
    answer = a - b
    const text = topic.decimals
      ? `${Math.max(a, b).toFixed(1)} - ${Math.min(a, b).toFixed(1)} = ?`
      : `${a} - ${b} = ?`
    return { text, answer, rawText: `${a}-${b}`, ops: ['-'] }
  }

  if (op === '×') {
    a = genNumber(topic.a)
    b = genNumber(topic.b || [2, 9])
    if (topic.maxResult !== undefined && a * b > topic.maxResult) {
      b = Math.floor(topic.maxResult / a)
      if (b < (topic.b?.[0] || 2)) b = topic.b?.[0] || 2
    }
    answer = a * b
    const text = topic.decimals
      ? `${a.toFixed(1)} × ${b.toFixed(1)} = ?`
      : `${a} × ${b} = ?`
    return { text, answer, rawText: `${a}×${b}`, ops: ['×'] }
  }

  if (op === '÷') {
    a = genNumber(topic.a)
    b = genNumber(topic.b || [2, 9])
    // 保证整除：被除数 = 除数 × 商
    const quotient = randInt(2, 9)
    a = b * quotient
    answer = quotient
    const text = topic.decimals
      ? `${a.toFixed(1)} ÷ ${b.toFixed(1)} = ?`
      : `${a} ÷ ${b} = ?`
    return { text, answer, rawText: `${a}÷${b}`, ops: ['÷'] }
  }

  throw new Error(`不支持的运算: ${op}`)
}

/** 生成展示用的示例题目（每个年级3道） */
export function getExamples(gradeSemester: GradeSemester): string[] {
  return QUESTION_BANK[gradeSemester]?.examples || []
}
