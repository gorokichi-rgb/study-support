const subjects = [
  "すべて",
  "数学1","数学A","数学2","数学B","数学3","数学C",
  "物理","物理基礎","化学","英語","情報","文学","地理総合"
];

let currentSubject = "すべて";
let currentLevel = "all";

let list = JSON.parse(localStorage.getItem("list") || "[]");

const tabs = document.getElementById("tabs");
const listDiv = document.getElementById("list");
const subjectSelect = document.getElementById("subjectInput");

/* 初期化 */
subjects.forEach(s => {
  const tab = document.createElement("button");
  tab.textContent = s;
  tab.className = "tab";
  if (s === "すべて") tab.classList.add("active");

  tab.onclick = () => {
    currentSubject = s;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    display();
  };

  tabs.appendChild(tab);

  if (s !== "すべて") {
    const op = document.createElement("option");
    op.value = s;
    op.textContent = s;
    subjectSelect.appendChild(op);
  }
});

display();

/* 到達度切り替え */
function setLevel(level) {
  currentLevel = level;
  document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("lv-" + level).classList.add("active");
  display();
}

/* 追加 */
function addItem() {
  const title = titleInput.value;
  if (!title) return;

  list.push({
    id: Date.now(),
    title,
    subject: subjectSelect.value,
    level: levelInput.value
  });

  save();
  display();
  titleInput.value = "";
}

/* 表示 */
function display() {
  listDiv.innerHTML = "";

  list
    .filter(i =>
      (currentSubject === "すべて" || i.subject === currentSubject) &&
      (currentLevel === "all" || i.level === currentLevel)
    )
    .forEach(i => listDiv.appendChild(createItem(i)));
}

/* カード生成 */
function createItem(item) {
  const div = document.createElement("div");
  div.className = `item ${item.level}`;

  const bar = document.createElement("div");
  bar.className = "level-bar";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.title;

  const btn = document.createElement("div");
  btn.className = "menu-btn";
  btn.textContent = "︙";

  const menu = document.createElement("div");
  menu.className = "menu";

  btn.onclick = e => {
    e.stopPropagation();
    document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
    menu.style.display = "block";
  };

  ["perfect","almost","yet"].forEach(l => {
    const b = document.createElement("button");
    b.textContent = l === "perfect" ? "完璧" : l === "almost" ? "あと少し" : "まだ";
    b.onclick = () => {
      item.level = l;
      save();
      display();
    };
    menu.appendChild(b);
  });

  const del = document.createElement("button");
  del.textContent = "削除";
  del.onclick = () => {
    list = list.filter(i => i.id !== item.id);
    save();
    display();
  };
  menu.appendChild(del);

  div.appendChild(bar);
  div.appendChild(title);
  div.appendChild(btn);
  div.appendChild(menu);

  return div;
}

function save() {
  localStorage.setItem("list", JSON.stringify(list));
}

document.body.onclick = () => {
  document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
};

