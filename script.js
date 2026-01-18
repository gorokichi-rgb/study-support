const subjects = [
  "すべて",
  "数学1","数学A","数学2","数学B","数学3","数学C",
  "物理基礎","物理","英語","デッサン","文学","情報","地理総合","化学",
  "模試数学","模試物理","模試英語","その他模試"
]

let currentSubject = "すべて"
let currentLevel = "all"

let list = JSON.parse(localStorage.getItem("list") || "[]")

const tabs = document.getElementById("tabs")
const listDiv = document.getElementById("list")
const subjectSelect = document.getElementById("subjectInput")
const titleInput = document.getElementById("titleInput")
const levelInput = document.getElementById("levelInput")

/* ===== 科目タブ初期化 ===== */
subjects.forEach(s => {
  const tab = document.createElement("button")
  tab.textContent = s
  tab.className = "tab"
  if (s === "すべて") tab.classList.add("active")

  tab.onclick = e => {
    e.stopPropagation()
    currentSubject = s
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
    tab.classList.add("active")
    display()
  }

  tabs.appendChild(tab)

  if (s !== "すべて") {
    const op = document.createElement("option")
    op.value = s
    op.textContent = s
    subjectSelect.appendChild(op)
  }
})

display()

/* ===== 到達度切り替え ===== */
function setLevel(level) {
  currentLevel = level
  document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"))
  document.getElementById("lv-" + level).classList.add("active")
  display()
}

/* ===== 追加 ===== */
function addItem() {
  const title = titleInput.value.trim()
  if (!title) return

  list.push({
    id: Date.now(),
    title,
    subject: subjectSelect.value,
    level: levelInput.value
  })

  save()
  display()
  titleInput.value = ""
}

/* ===== 表示 ===== */
function display() {
  listDiv.innerHTML = ""

  list
    .filter(i =>
      (currentSubject === "すべて" || i.subject === currentSubject) &&
      (currentLevel === "all" || i.level === currentLevel)
    )
    .forEach(i => listDiv.appendChild(createItem(i)))
}

/* ===== 単元カード生成 ===== */
function createItem(item) {
  const div = document.createElement("div")
  div.className = `item ${item.level}`

  const bar = document.createElement("div")
  bar.className = "level-bar"

  const title = document.createElement("div")
  title.className = "title"
  title.textContent = item.title

  const btn = document.createElement("div")
  btn.className = "menu-btn"
  btn.textContent = "︙"

  const menu = document.createElement("div")
  menu.className = "menu"

  btn.onclick = e => {
    e.stopPropagation()
    document.querySelectorAll(".menu").forEach(m => m.style.display = "none")
    menu.style.display = "block"
  }

  const levels = [
    ["perfect","完璧"],
    ["almost","もう少し"],
    ["yet","まだ"],
    ["mock-ok","模試で正解"],
    ["mock-ng","模試で不正解"]
  ]

  levels.forEach(([val, label]) => {
    const b = document.createElement("button")
    b.textContent = label
    b.onclick = () => {
      item.level = val
      save()
      display()
    }
    menu.appendChild(b)
  })

  const del = document.createElement("button")
  del.textContent = "削除"
  del.onclick = () => {
    list = list.filter(i => i.id !== item.id)
    save()
    display()
  }
  menu.appendChild(del)

  div.appendChild(bar)
  div.appendChild(title)
  div.appendChild(btn)
  div.appendChild(menu)

  return div
}

/* ===== 保存 ===== */
function save() {
  localStorage.setItem("list", JSON.stringify(list))
}

/* ===== ヘッダーメニュー ===== */
let pendingAction = null

function openHeaderMenu(e) {
  if (e) e.stopPropagation()
  const menu = document.getElementById("headerMenu")
  menu.style.display = menu.style.display === "block" ? "none" : "block"
}

/* ===== 確認モーダル ===== */
function confirmAction(type) {
  pendingAction = type
  document.getElementById("headerMenu").style.display = "none"

  document.getElementById("modalText").textContent =
    type === "import" ? "インポートの実行" :
    type === "export" ? "エクスポートの実行" :
    "初期化の実行"

  document.getElementById("modalBg").style.display = "block"
}

function closeModal() {
  document.getElementById("modalBg").style.display = "none"
  pendingAction = null
}

function executeAction() {
  if (pendingAction === "export") {
    const data = JSON.stringify(list)
    navigator.clipboard.writeText(data)
  }

  if (pendingAction === "import") {
    const data = prompt("データを貼り付け")
    if (data) {
      list = JSON.parse(data)
      save()
      display()
    }
  }

  if (pendingAction === "reset") {
    list = []
    save()
    display()
  }

  closeModal()
}

/* ===== 画面タップで閉じる（統合版） ===== */
document.body.onclick = () => {
  document.querySelectorAll(".menu").forEach(m => {
    m.style.display = "none"
  })

  const headerMenu = document.getElementById("headerMenu")
  if (headerMenu) headerMenu.style.display = "none"
}

document.getElementById("headerMenu").onclick = e => {
  e.stopPropagation()
}

