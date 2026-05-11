// main.ts — 题库验证 Demo 入口
import { GradeSemester } from './config/questionBank'
import { generateDiceQuestion, getExamples } from './services/QuestionGenerator'

document.addEventListener('DOMContentLoaded', () => {
  const gradeSelect = document.getElementById('gradeSelect') as HTMLSelectElement
  const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement
  const resultDiv = document.getElementById('result') as HTMLDivElement
  const summaryDiv = document.getElementById('summary') as HTMLDivElement

  /** 简单验证题目结果是否在合理范围 */
  function validateQuestion(q: ReturnType<typeof generateDiceQuestion>, grade: GradeSemester): boolean {
    if (isNaN(q.answer)) return false
    if (!isFinite(q.answer)) return false
    if (grade.startsWith('1')) return q.answer <= 20 && q.answer >= -20
    if (grade.startsWith('2')) return q.answer <= 100 && q.answer >= -100
    return true
  }

  function validateGrade(grade: GradeSemester): void {
    resultDiv.innerHTML = ''

    // 示例题
    const examples = getExamples(grade)
    const examplesDiv = document.createElement('div')
    examplesDiv.innerHTML = `<h2>📚 ${grade} 示例题目</h2>
      <div class="grid">${examples.map(ex => `
        <div class="card example">
          <div class="q-status"></div>
          <span class="q-text">${ex}</span>
          <span class="q-meta">示例</span>
        </div>`).join('')}</div>`
    resultDiv.appendChild(examplesDiv)

    // 随机题
    const h2 = document.createElement('h2')
    h2.textContent = `🎲 随机生成10道题`
    resultDiv.appendChild(h2)

    const grid = document.createElement('div')
    grid.className = 'grid'

    let errors: string[] = []
    let success = 0

    for (let i = 0; i < 10; i++) {
      try {
        const q = generateDiceQuestion(grade)
        const card = document.createElement('div')
        card.className = 'card'

        const isValid = validateQuestion(q, grade)
        if (!isValid) {
          errors.push(`第${i+1}题: ${q.text} (答案:${q.answer}) 超出年级范围`)
          card.classList.add('fail')
        } else {
          success++
          card.classList.add('pass')
        }

        card.innerHTML = `
          <div class="q-status"></div>
          <span class="q-text">${q.text}</span>
          <span class="q-meta">答案: ${Number.isInteger(q.answer) ? q.answer : q.answer.toFixed(2)}</span>
        `
        grid.appendChild(card)
      } catch (e) {
        errors.push(`第${i+1}题生成失败: ${e}`)
      }
    }

    resultDiv.appendChild(grid)

    // 汇总
    const summary = document.createElement('div')
    summary.className = 'summary'
    if (errors.length === 0) {
      summary.innerHTML = `<span class="icon">✅</span> <span class="pass">${success}/10 通过验证！年级运算配置正常。</span>`
    } else {
      summary.innerHTML = `<span class="icon">⚠️</span> <span class="fail">${success}/10 通过</span>
        <details style="margin-top:0.5rem;width:100%;"><summary style="cursor:pointer;color:#fbbf24;">查看${errors.length}个问题</summary>
        <pre style="margin-top:0.5rem;color:#ef4444;font-size:0.85em;">${errors.join('\n')}</pre></details>`
    }
    summaryDiv.innerHTML = ''
    summaryDiv.appendChild(summary)
  }

  generateBtn.addEventListener('click', () => {
    const grade = gradeSelect.value as GradeSemester
    validateGrade(grade)
  })
})
