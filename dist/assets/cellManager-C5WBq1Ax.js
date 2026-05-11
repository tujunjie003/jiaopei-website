import"./modulepreload-polyfill-wMinxHhO.js";function e(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function t(t){let n=t.trim().split(`
`),r=[];for(let t of n){if(t.includes(`格子`)||t.includes(`题目`)||t.startsWith(`#`))continue;let n=t.split(/[,\t]/);if(n.length<3)continue;let i=parseInt(n[0].trim());isNaN(i)||i<1||r.push({id:e(),cellNumber:i,question:n[1].trim(),answer:parseFloat(n[2].trim()),hint:n[3]?.trim()||void 0})}return r}function n(e){return`# 格子,题目,答案,提示
`+e.sort((e,t)=>e.cellNumber-t.cellNumber).map(e=>`${e.cellNumber},${e.question},${e.answer},${e.hint||``}`).join(`
`)}function r(e){let t=`# 格式说明：第一列为格子编号（1-`+e+`），第二列为题目，第三列为答案，第四列为提示（可选）
`,n=Array.from({length:e},(e,t)=>`${t+1},,,\n`).join(``);return t+`格子,题目,答案,提示
`+n}function i(e,t){let n=[];return e.some(e=>e.cellNumber<1||e.cellNumber>t)&&n.push(`格子编号必须在 1-${t} 之间`),e.some(e=>isNaN(e.answer))&&n.push(`答案必须为数字`),e.some(e=>!e.question.trim())&&n.push(`题目不能为空`),{valid:n.length===0,errors:n}}var a=`math_flight_chess_cells`;function o(){let e=localStorage.getItem(a);if(e)try{return JSON.parse(e)}catch{}return{totalCells:20,questions:[]}}function s(e){localStorage.setItem(a,JSON.stringify(e))}var c=o(),l=null,u=document.getElementById(`app`);function d(){u.innerHTML=`
    <div class="header">
      <h1>📋 格子题管理</h1>
      <p>预设每格的答题题目，课堂游戏时学生落到该格触发答题</p>
    </div>

    <div class="toolbar">
      <div class="total-cells-group">
        <label>总格子数：</label>
        <input type="number" id="totalCellsInput" value="${c.totalCells}" min="5" max="52" aria-label="总格子数">
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
      <span>已填题目：<strong>${c.questions.length}</strong> / ${c.totalCells}</span>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(c.questions.length/c.totalCells*100)}%"></div></div>
      <span>${Math.round(c.questions.length/c.totalCells*100)}%</span>
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
          ${c.questions.length===0?`<tr><td colspan="5" class="empty">暂无题目，点击右上角「添加题目」或「粘贴导入」</td></tr>`:c.questions.sort((e,t)=>e.cellNumber-t.cellNumber).map(e=>`
                <tr data-id="${e.id}">
                  <td class="cell-num">${e.cellNumber}</td>
                  <td class="cell-q">${e.question}</td>
                  <td class="cell-a">${Number.isInteger(e.answer)?e.answer:e.answer.toFixed(2)}</td>
                  <td class="cell-hint">${e.hint||`—`}</td>
                  <td>
                    <button class="btn-icon edit-btn" data-id="${e.id}" title="编辑">✏️</button>
                    <button class="btn-icon del-btn" data-id="${e.id}" title="删除">🗑️</button>
                  </td>
                </tr>`).join(``)}
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="添加/编辑题目">
        <h2 id="modalTitle">添加题目</h2>
        <div class="form-group">
          <label for="cellNumInput">格子编号</label>
          <input type="number" id="cellNumInput" min="1" max="${c.totalCells}" aria-label="格子编号">
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
  `,f()}function f(){document.getElementById(`saveTotalBtn`).addEventListener(`click`,()=>{let e=document.getElementById(`totalCellsInput`),t=parseInt(e.value);if(t<5||t>52){p(`格子数需在 5-52 之间`,`error`);return}c.totalCells=t,s(c),p(`格子数已保存`,`success`),d()}),document.getElementById(`downloadTemplateBtn`).addEventListener(`click`,()=>{let e=r(c.totalCells);m(`格子题模板_${c.totalCells}格.csv`,e,`text/csv`),p(`模板下载中…`,`success`)}),document.getElementById(`exportBtn`).addEventListener(`click`,()=>{if(c.questions.length===0){p(`暂无题目可导出`,`error`);return}let e=n(c.questions);m(`格子题_${c.questions.length}题.csv`,e,`text/csv`),p(`导出中…`,`success`)}),document.getElementById(`importBtn`).addEventListener(`click`,()=>{document.getElementById(`importModal`).classList.add(`show`),document.getElementById(`importTextarea`).value=``,document.getElementById(`importPreview`).innerHTML=``}),document.getElementById(`importTextarea`).addEventListener(`input`,e=>{let n=e.target.value;if(n.trim())try{let e=t(n),{errors:r}=i(e,c.totalCells),a=document.getElementById(`importPreview`);r.length>0?a.innerHTML=`<span class="error">⚠️ ${r[0]}</span>`:a.innerHTML=`<span class="success">✅ 解析成功，将导入 ${e.length} 道题目（覆盖同名格子）</span>`}catch{preview.innerHTML=`<span class="error">⚠️ 格式解析失败</span>`}}),document.getElementById(`importConfirmBtn`).addEventListener(`click`,()=>{let e=document.getElementById(`importTextarea`).value,n=t(e),{valid:r,errors:a}=i(n,c.totalCells);if(!r){p(a[0],`error`);return}c.questions=[...c.questions.filter(e=>!n.find(t=>t.cellNumber===e.cellNumber)),...n],s(c),document.getElementById(`importModal`).classList.remove(`show`),p(`已导入 ${n.length} 道题目`,`success`),d()}),document.getElementById(`importCancelBtn`).addEventListener(`click`,()=>{document.getElementById(`importModal`).classList.remove(`show`)}),document.getElementById(`addBtn`).addEventListener(`click`,()=>{l=null,document.getElementById(`modalTitle`).textContent=`添加题目`,document.getElementById(`cellNumInput`).value=``,document.getElementById(`questionInput`).value=``,document.getElementById(`answerInput`).value=``,document.getElementById(`hintInput`).value=``,document.getElementById(`modalOverlay`).classList.add(`show`),document.getElementById(`cellNumInput`).focus()}),document.querySelectorAll(`.edit-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id,n=c.questions.find(e=>e.id===t);n&&(l=t,document.getElementById(`modalTitle`).textContent=`编辑题目`,document.getElementById(`cellNumInput`).value=String(n.cellNumber),document.getElementById(`questionInput`).value=n.question,document.getElementById(`answerInput`).value=String(n.answer),document.getElementById(`hintInput`).value=n.hint||``,document.getElementById(`modalOverlay`).classList.add(`show`))})}),document.querySelectorAll(`.del-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id;c.questions=c.questions.filter(e=>e.id!==t),s(c),p(`已删除`,`success`),d()})}),document.getElementById(`cancelBtn`).addEventListener(`click`,()=>{document.getElementById(`modalOverlay`).classList.remove(`show`)}),document.getElementById(`modalOverlay`).addEventListener(`click`,e=>{e.target===document.getElementById(`modalOverlay`)&&document.getElementById(`modalOverlay`).classList.remove(`show`)}),document.getElementById(`saveBtn`).addEventListener(`click`,()=>{let t=parseInt(document.getElementById(`cellNumInput`).value),n=document.getElementById(`questionInput`).value.trim(),r=parseFloat(document.getElementById(`answerInput`).value),i=document.getElementById(`hintInput`).value.trim();if(!t||t<1||t>c.totalCells){p(`格子编号需在 1-${c.totalCells}`,`error`);return}if(!n){p(`题目不能为空`,`error`);return}if(isNaN(r)){p(`答案必须是数字`,`error`);return}if(l){let e=c.questions.findIndex(e=>e.id===l);e>=0&&(c.questions[e]={...c.questions[e],cellNumber:t,question:n,answer:r,hint:i||void 0})}else{let a=c.questions.findIndex(e=>e.cellNumber===t);a>=0?c.questions[a]={id:c.questions[a].id,cellNumber:t,question:n,answer:r,hint:i||void 0}:c.questions.push({id:e(),cellNumber:t,question:n,answer:r,hint:i||void 0})}s(c),document.getElementById(`modalOverlay`).classList.remove(`show`),p(l?`已更新`:`已添加`,`success`),l=null,d()})}function p(e,t=`success`){let n=document.getElementById(`toast`);n.textContent=e,n.className=`toast show ${t}`,setTimeout(()=>n.classList.remove(`show`),2500)}function m(e,t,n){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}document.addEventListener(`DOMContentLoaded`,()=>{d()});