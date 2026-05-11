// cellQuestions.ts — 格子题实体与服务
export interface CellQuestion {
  id: string
  cellNumber: number  // 1-52
  question: string      // 题目文本
  answer: number        // 正确答案
  hint?: string        // 可选提示
}

export interface CellQuestionStore {
  totalCells: number
  questions: CellQuestion[]
}

/** 生成唯一ID */
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

/** 从 CSV 文本解析题库 */
export function parseCSV(text: string): CellQuestion[] {
  const lines = text.trim().split('\n')
  const questions: CellQuestion[] = []
  for (const line of lines) {
    // Skip header
    if (line.includes('格子') || line.includes('题目') || line.startsWith('#')) continue
    const parts = line.split(/[,\t]/)
    if (parts.length < 3) continue
    const cell = parseInt(parts[0].trim())
    if (isNaN(cell) || cell < 1) continue
    questions.push({
      id: genId(),
      cellNumber: cell,
      question: parts[1].trim(),
      answer: parseFloat(parts[2].trim()),
      hint: parts[3]?.trim() || undefined,
    })
  }
  return questions
}

/** 导出为 CSV 文本 */
export function toCSV(questions: CellQuestion[]): string {
  const header = '# 格子,题目,答案,提示\n'
  const rows = questions
    .sort((a, b) => a.cellNumber - b.cellNumber)
    .map(q => `${q.cellNumber},${q.question},${q.answer},${q.hint || ''}`)
    .join('\n')
  return header + rows
}

/** 生成 Excel 模板（CSV 格式，可直接 Excel 打开） */
export function generateTemplate(totalCells: number): string {
  const header = '# 格式说明：第一列为格子编号（1-' + totalCells + '），第二列为题目，第三列为答案，第四列为提示（可选）\n'
  const header2 = '格子,题目,答案,提示\n'
  const rows = Array.from({ length: totalCells }, (_, i) => {
    return `${i + 1},,,\n`
  }).join('')
  return header + header2 + rows
}

/** 校验题目列表 */
export function validateQuestions(questions: CellQuestion[], totalCells: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (questions.some(q => q.cellNumber < 1 || q.cellNumber > totalCells)) {
    errors.push(`格子编号必须在 1-${totalCells} 之间`)
  }
  if (questions.some(q => isNaN(q.answer))) {
    errors.push('答案必须为数字')
  }
  if (questions.some(q => !q.question.trim())) {
    errors.push('题目不能为空')
  }
  return { valid: errors.length === 0, errors }
}
