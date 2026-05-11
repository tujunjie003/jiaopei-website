// cellManager.ts — 格子题管理 Demo 入口
import { CellQuestion, CellQuestionStore, genId, parseCSV, toCSV, generateTemplate, validateQuestions } from './domain/cellQuestions'

const STORAGE_KEY = 'math_flight_chess_cells'

/** 从 LocalStorage 加载 */
function load(): CellQuestionStore {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try { return JSON.parse(raw) } catch { /* ignore */ }
  }
  return { totalCells: 20, questions: [] }
}

/** 保存到 LocalStorage */
function save(store: CellQuestionStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

// DOM refs
let store = load()
let editingId: string | null = null

const app = document.getElementById('app')!

/** 渲染 */
function render(): void {
  app.innerHTML = `
    <div class="header">
      <h1>📋 格子题管理</h1>
      <p>预设每格的答题题目，课堂游戏时学生落到该格触发答题</p>
    </div>

    <div class="toolbar">
      <div class="total-cells-group">
        <label>总格子数：</label>
        <input type="number" id="totalCellsInput" value="${store.totalCells}" min="5" max="52" aria-label="总格子数">
        <button class="btn btn-outline" id="saveTotalBtn">保存</button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-outline" id="downloadTemplateBtn">📥 下载模板</button>
        <button class="btn btn-outline" id="exportBtn">📤 导出已填题目</button>
        <button class="btn" id="importBtn">📋 粘贴导入</button>
        <button class="btn btn-accent" id="addBtn">+ 添加题目</button>
      </div>
    </div>

    <div class="stats">
      <span>已填题目：<strong>${store.questions.length}</strong> / ${store.totalCells}</span>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(store.questions.length / store.totalCells * 100)}%"></div></div>
      <span>${Math.round(store.questions.length / store.totalCells * 100)}%</span>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>格子</th>
            <th>题目</th>
            <th>答案</th>
            <th>提示</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${store.questions.length === 0
            ? `<tr><td colspan="5" class="empty">暂无题目，点击右上角「添加题目」或「粘贴导入」</td></tr>`
            : store.questions
                .sort((a, b) => a.cellNumber - b.cellNumber)
                .map(q => `
                <tr data-id="${q.id}">
                  <td class="cell-num">${q.cellNumber}</td>
                  <td class="cell-q">${q.question}</td>
                  <td class="cell-a">${Number.isInteger(q.answer) ? q.answer : q.answer.toFixed(2)}</td>
                  <td class="cell-hint">${q.hint || '—'}</td>
                  <td>
                    <button class="btn-icon edit-btn" data-id="${q.id}" title="编辑">✏️</button>
                    <button class="btn-icon del-btn" data-id="${q.id}" title="删除">🗑️</button>
                  </td>
                </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="添加/编辑题目">
        <h2 id="modalTitle">添加题目</h2>
        <div class="form-group">
          <label for="cellNumInput">格子编号</label>
          <input type="number" id="cellNumInput" min="1" max="${store.totalCells}" aria-label="格子编号">
        </div>
        <div class="form-group">
          <label for="questionInput">题目</label>
          <input type="text" id="questionInput" placeholder="如：7 + 8 = ?" aria-label="题目">
        </div>
        <div class="form-group">
          <label for="answerInput">答案（数字）</label>
          <input type="number" id="answerInput" step="any" placeholder="如：15" aria-label="答案">
        </div>
        <div class="form-group">
          <label for="hintInput">提示（可选）</label>
          <input type="text" id="hintInput" placeholder="如：凑十法" aria-label="提示">
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="cancelBtn">取消</button>
          <button class="btn" id="saveBtn">保存</button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div class="modal-overlay" id="importModal">
      <div class="modal" role="dialog" aria-modal="true" aria-label="粘贴导入">
        <h2>📋 粘贴导入题目</h2>
        <p>从 Excel 或 CSV 粘贴内容，格式：<code>格子,题目,答案,提示</code></p>
        <textarea id="importTextarea" placeholder="1,7 + 8 = ?,15,凑十法\n2,12 - 5 = ?,7\n..." aria-label="粘贴内容"></textarea>
        <div class="import-preview" id="importPreview"></div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="importCancelBtn">取消</button>
          <button class="btn" id="importConfirmBtn">确认导入</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>
  `
  bindEvents()
}

/** 绑定事件 */
function bindEvents(): void {
  document.getElementById('saveTotalBtn')!.addEventListener('click', () => {
    const input = document.getElementById('totalCellsInput') as HTMLInputElement
    const n = parseInt(input.value)
    if (n < 5 || n > 52) { showToast('格子数需在 5-52 之间', 'error'); return }
    store.totalCells = n
    save(store)
    showToast('格子数已保存', 'success')
    render()
  })

  document.getElementById('downloadTemplateBtn')!.addEventListener('click', () => {
    const csv = generateTemplate(store.totalCells)
    downloadFile(`格子题模板_${store.totalCells}格.csv`, csv, 'text/csv')
    showToast('模板下载中…', 'success')
  })

  document.getElementById('exportBtn')!.addEventListener('click', () => {
    if (store.questions.length === 0) { showToast('暂无题目可导出', 'error'); return }
    const csv = toCSV(store.questions)
    downloadFile(`格子题_${store.questions.length}题.csv`, csv, 'text/csv')
    showToast('导出中…', 'success')
  })

  document.getElementById('importBtn')!.addEventListener('click', () => {
    document.getElementById('importModal')!.classList.add('show')
    document.getElementById('importTextarea')!.value = ''
    document.getElementById('importPreview')!.innerHTML = ''
  })

  document.getElementById('importTextarea')!.addEventListener('input', (e) => {
    const text = (e.target as HTMLTextAreaElement).value
    if (!text.trim()) return
    try {
      const qs = parseCSV(text)
      const { errors } = validateQuestions(qs, store.totalCells)
      const preview = document.getElementById('importPreview')!
      if (errors.length > 0) {
        preview.innerHTML = `<span class="error">⚠️ ${errors[0]}</span>`
      } else {
        preview.innerHTML = `<span class="success">✅ 解析成功，将导入 ${qs.length} 道题目（覆盖同名格子）</span>`
      }
    } catch {
      preview.innerHTML = `<span class="error">⚠️ 格式解析失败</span>`
    }
  })

  document.getElementById('importConfirmBtn')!.addEventListener('click', () => {
    const text = document.getElementById('importTextarea')!.value
    const qs = parseCSV(text)
    const { valid, errors } = validateQuestions(qs, store.totalCells)
    if (!valid) { showToast(errors[0], 'error'); return }
    // Merge: new questions replace existing ones with same cell number
    const existing = store.questions.filter(q => !qs.find(nq => nq.cellNumber === q.cellNumber))
    store.questions = [...existing, ...qs]
    save(store)
    document.getElementById('importModal')!.classList.remove('show')
    showToast(`已导入 ${qs.length} 道题目`, 'success')
    render()
  })

  document.getElementById('importCancelBtn')!.addEventListener('click', () => {
    document.getElementById('importModal')!.classList.remove('show')
  })

  document.getElementById('addBtn')!.addEventListener('click', () => {
    editingId = null
    ;(document.getElementById('modalTitle') as HTMLElement).textContent = '添加题目'
    ;(document.getElementById('cellNumInput') as HTMLInputElement).value = ''
    ;(document.getElementById('questionInput') as HTMLInputElement).value = ''
    ;(document.getElementById('answerInput') as HTMLInputElement).value = ''
    ;(document.getElementById('hintInput') as HTMLInputElement).value = ''
    document.getElementById('modalOverlay')!.classList.add('show')
    document.getElementById('cellNumInput')!.focus()
  })

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLButtonElement).dataset.id!
      const q = store.questions.find(q => q.id === id)
      if (!q) return
      editingId = id
      ;(document.getElementById('modalTitle') as HTMLElement).textContent = '编辑题目'
      ;(document.getElementById('cellNumInput') as HTMLInputElement).value = String(q.cellNumber)
      ;(document.getElementById('questionInput') as HTMLInputElement).value = q.question
      ;(document.getElementById('answerInput') as HTMLInputElement).value = String(q.answer)
      ;(document.getElementById('hintInput') as HTMLInputElement).value = q.hint || ''
      document.getElementById('modalOverlay')!.classList.add('show')
    })
  })

  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLButtonElement).dataset.id!
      store.questions = store.questions.filter(q => q.id !== id)
      save(store)
      showToast('已删除', 'success')
      render()
    })
  })

  document.getElementById('cancelBtn')!.addEventListener('click', () => {
    document.getElementById('modalOverlay')!.classList.remove('show')
  })

  document.getElementById('modalOverlay')!.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
      document.getElementById('modalOverlay')!.classList.remove('show')
    }
  })

  document.getElementById('saveBtn')!.addEventListener('click', () => {
    const cellNum = parseInt((document.getElementById('cellNumInput') as HTMLInputElement).value)
    const question = (document.getElementById('questionInput') as HTMLInputElement).value.trim()
    const answer = parseFloat((document.getElementById('answerInput') as HTMLInputElement).value)
    const hint = (document.getElementById('hintInput') as HTMLInputElement).value.trim()

    if (!cellNum || cellNum < 1 || cellNum > store.totalCells) { showToast(`格子编号需在 1-${store.totalCells}`, 'error'); return }
    if (!question) { showToast('题目不能为空', 'error'); return }
    if (isNaN(answer)) { showToast('答案必须是数字', 'error'); return }

    if (editingId) {
      // Edit existing
      const idx = store.questions.findIndex(q => q.id === editingId)
      if (idx >= 0) {
        store.questions[idx] = { ...store.questions[idx], cellNumber: cellNum, question, answer, hint: hint || undefined }
      }
    } else {
      // Add new: replace if same cell number exists
      const existingIdx = store.questions.findIndex(q => q.cellNumber === cellNum)
      if (existingIdx >= 0) {
        store.questions[existingIdx] = { id: store.questions[existingIdx].id, cellNumber: cellNum, question, answer, hint: hint || undefined }
      } else {
        store.questions.push({ id: genId(), cellNumber: cellNum, question, answer, hint: hint || undefined })
      }
    }

    save(store)
    document.getElementById('modalOverlay')!.classList.remove('show')
    showToast(editingId ? '已更新' : '已添加', 'success')
    editingId = null
    render()
  })
}

function showToast(msg: string, type: 'success' | 'error' = 'success'): void {
  const toast = document.getElementById('toast')!
  toast.textContent = msg
  toast.className = `toast show ${type}`
  setTimeout(() => toast.classList.remove('show'), 2500)
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

document.addEventListener('DOMContentLoaded', () => { render() })
