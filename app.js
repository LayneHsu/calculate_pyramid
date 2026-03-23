// 与 calculate_pyramid.py 中公式一致的金字塔计算, 供页面渲染使用

const DOWN_RATIOS = [0.1, 0.2, 0.3, 0.4];
const UP_RATIOS = [0.4, 0.3, 0.2, 0.1];

const DEFAULT_DOWN_STEP = 0.03;
const DEFAULT_UP_STEP = 0.02;

// 解析正数, 用于当前价、总资金
function parsePositiveNumber(raw) {
  const s = String(raw).trim();
  if (s === "") {
    return { ok: false, message: "不能为空" };
  }
  const n = Number(s);
  if (!Number.isFinite(n)) {
    return { ok: false, message: "请输入有效数字" };
  }
  if (n <= 0) {
    return { ok: false, message: "须大于 0" };
  }
  return { ok: true, value: n };
}

// 解析步长, 空串则用默认值
function parsePriceStep(raw, defaultValue) {
  const s = String(raw).trim();
  if (s === "") {
    return { ok: true, value: defaultValue };
  }
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, message: "须为大于 0 的数字" };
  }
  return { ok: true, value: n };
}

// 下跌金字塔: 目标价 = 当前价 * (1 - 步长 * i)
function calculateDownPyramid(currentPrice, totalCapital, priceStep) {
  return DOWN_RATIOS.map((ratio, i) => ({
    tier: i + 1,
    price: currentPrice * (1 - priceStep * i),
    amount: totalCapital * ratio,
    ratio,
  }));
}

// 上涨金字塔: 目标价 = 当前价 * (1 + 步长 * i)
function calculateUpPyramid(currentPrice, totalCapital, priceStep) {
  return UP_RATIOS.map((ratio, i) => ({
    tier: i + 1,
    price: currentPrice * (1 + priceStep * i),
    amount: totalCapital * ratio,
    ratio,
  }));
}

// 校验表单, 通过则返回计算参数
function validateForm(currentPriceRaw, totalCapitalRaw, downStepRaw, upStepRaw) {
  const p = parsePositiveNumber(currentPriceRaw);
  if (!p.ok) {
    return { ok: false, field: "currentPrice", message: p.message };
  }
  const c = parsePositiveNumber(totalCapitalRaw);
  if (!c.ok) {
    return { ok: false, field: "totalCapital", message: c.message };
  }
  const ds = parsePriceStep(downStepRaw, DEFAULT_DOWN_STEP);
  if (!ds.ok) {
    return { ok: false, field: "downStep", message: ds.message };
  }
  const us = parsePriceStep(upStepRaw, DEFAULT_UP_STEP);
  if (!us.ok) {
    return { ok: false, field: "upStep", message: us.message };
  }
  return {
    ok: true,
    currentPrice: p.value,
    totalCapital: c.value,
    downStep: ds.value,
    upStep: us.value,
  };
}

function formatMoney(n) {
  return n.toFixed(2);
}

function formatPercent(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

// 将行数据写入表格 tbody
function fillTableBody(tbody, rows) {
  tbody.replaceChildren();
  for (const row of rows) {
    const tr = document.createElement("tr");
    const cells = [
      String(row.tier),
      formatMoney(row.price),
      formatMoney(row.amount),
      formatPercent(row.ratio),
    ];
    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function setSectionError(sectionEl, message) {
  const err = sectionEl.querySelector("[data-error]");
  const tables = sectionEl.querySelectorAll("table");
  if (err) {
    err.textContent = message || "";
    err.hidden = !message;
  }
  for (const t of tables) {
    t.hidden = !!message;
  }
}

function initPage() {
  const currentPriceEl = document.getElementById("currentPrice");
  const totalCapitalEl = document.getElementById("totalCapital");
  const downStepEl = document.getElementById("downStep");
  const upStepEl = document.getElementById("upStep");
  const globalErrorEl = document.getElementById("globalError");

  const downSection = document.getElementById("downSection");
  const upSection = document.getElementById("upSection");
  const downTbody = document.querySelector("#downTable tbody");
  const upTbody = document.querySelector("#upTable tbody");

  function fieldLabel(field) {
    const map = {
      currentPrice: "当前价格",
      totalCapital: "总资金",
      downStep: "下跌步长",
      upStep: "上涨步长",
    };
    return map[field] || field;
  }

  function recalc() {
    const v = validateForm(
      currentPriceEl.value,
      totalCapitalEl.value,
      downStepEl.value,
      upStepEl.value
    );

    globalErrorEl.textContent = "";
    globalErrorEl.hidden = true;
    setSectionError(downSection, "");
    setSectionError(upSection, "");

    if (!v.ok) {
      globalErrorEl.textContent = `请修正「${fieldLabel(v.field)}」: ${v.message}`;
      globalErrorEl.hidden = false;
      downTbody.replaceChildren();
      upTbody.replaceChildren();
      return;
    }

    const downRows = calculateDownPyramid(v.currentPrice, v.totalCapital, v.downStep);
    const upRows = calculateUpPyramid(v.currentPrice, v.totalCapital, v.upStep);
    fillTableBody(downTbody, downRows);
    fillTableBody(upTbody, upRows);

    document.getElementById("downInitialHint").textContent = `初始价: ${formatMoney(v.currentPrice)}`;
    document.getElementById("upInitialHint").textContent = `初始价: ${formatMoney(v.currentPrice)}`;
  }

  for (const el of [currentPriceEl, totalCapitalEl, downStepEl, upStepEl]) {
    el.addEventListener("input", recalc);
    el.addEventListener("change", recalc);
  }

  recalc();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
