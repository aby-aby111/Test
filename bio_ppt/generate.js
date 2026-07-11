// 高一上生物第一章《走近细胞》教学PPT
// 人教版必修1《分子与细胞》
"use strict";

const PptxGenJS = require("pptxgenjs");
const { warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } =
  require("./pptxgenjs_helpers/layout");

// ============ 主题配置 ============
const FONT = "Noto Sans CJK SC";   // 中文字体
const FONT_EN = "DejaVu Sans";     // 西文/数字

const C = {
  bg:        "FFFFFF",
  bgLight:   "F1F8E9",   // 浅绿背景
  bgCard:    "E8F5E9",   // 卡片底
  primary:   "1B5E20",   // 深绿(主色)
  green:     "2E7D32",   // 主绿
  teal:      "00897B",   // 青色
  accent:    "FF6F00",   // 橙色(重点标记)
  red:       "C62828",   // 红色(警示/易错)
  text:      "212121",   // 正文
  textSoft:  "424242",   // 次正文
  textMute:  "757575",   // 弱文字
  white:     "FFFFFF",
  divider:   "C8E6C9",   // 浅色分隔线
  highlight: "FFF8E1",   // 重点高亮底色
  highlightBorder: "FFB300",
};

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: SLIDE_W, height: SLIDE_H });
pptx.layout = "WIDE";
pptx.author = "高一生物课件";
pptx.subject = "第一章 走近细胞";

// ============ 通用组件函数 ============

// 顶部标题栏：左侧绿色色块 + 章节标签 + 标题
function addHeader(slide, sectionLabel, title, opts = {}) {
  const y = opts.y || 0.32;
  // 左侧绿色竖条
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: y + 0.04, w: 0.16, h: 0.72,
    fill: { color: C.green }, line: { type: "none" },
  });
  // 章节标签（与标题竖向分离，避免文本框重叠）
  slide.addText(sectionLabel, {
    x: 0.85, y: y, w: 8, h: 0.28,
    fontFace: FONT, fontSize: 13, color: C.teal, bold: true,
    charSpacing: 2, valign: "middle",
  });
  // 标题
  slide.addText(title, {
    x: 0.85, y: y + 0.32, w: 11, h: 0.5,
    fontFace: FONT, fontSize: 25, color: C.primary, bold: true,
    valign: "middle",
  });
  // 分隔线
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6, y: y + 0.92, w: 12.13, h: 0,
    line: { color: C.divider, width: 1.2 },
  });
}

// 页脚
function addFooter(slide, pageNum, total) {
  slide.addText("高一生物 · 必修1《分子与细胞》  ·  第一章 走近细胞", {
    x: 0.6, y: 7.08, w: 8, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.textMute, valign: "middle",
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 11.4, y: 7.08, w: 1.33, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.textMute,
    align: "right", valign: "middle",
  });
}

// 重点标记框（橙边 + 浅黄底）
// items: [{text, bold?}] 或 字符串数组
function addKeyPointBox(slide, x, y, w, h, title, items, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: C.highlight },
    line: { color: C.highlightBorder, width: 1.5 },
  });
  // 标题条 + 标签文字：文字叠在色块上是标准徽章设计（intentional overlap）
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.55, h: 0.42,
    rectRadius: 0.08,
    fill: { color: C.accent }, line: { type: "none" },
  });
  slide.addText("★ " + title, {
    x, y, w: 1.55, h: 0.42,
    fontFace: FONT, fontSize: 12, color: C.white, bold: true,
    align: "center", valign: "middle",
  });
  // 内容
  const runs = [];
  const arr = Array.isArray(items) ? items : [items];
  arr.forEach((it, i) => {
    if (i > 0) runs.push({ text: "\n", options: { breakLine: true } });
    if (typeof it === "string") {
      runs.push({ text: "• " + it, options: { fontSize: 12.5 } });
    } else {
      runs.push({ text: "• ", options: { fontSize: 12.5, bold: true, color: C.accent } });
      runs.push({ text: it.text, options: { fontSize: 12.5, bold: !!it.bold, color: it.color || C.text } });
    }
  });
  slide.addText(runs, {
    x: x + 0.18, y: y + 0.5, w: w - 0.36, h: h - 0.58,
    fontFace: FONT, color: C.text, valign: "top",
    paraSpaceAfter: 4,
  });
}

// 普通内容卡片（浅绿底）
function addCard(slide, x, y, w, h, title, body, opts = {}) {
  const accent = opts.accent || C.green;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.06,
    fill: { color: C.bgCard },
    line: { color: accent, width: 1 },
  });
  // 顶部色条
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.06,
    fill: { color: accent }, line: { type: "none" },
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.34,
      fontFace: FONT, fontSize: 14, color: accent, bold: true,
      valign: "middle",
    });
  }
  if (body) {
    const runs = typeof body === "string"
      ? [{ text: body, options: {} }]
      : body;
    slide.addText(runs, {
      x: x + 0.18, y: y + (title ? 0.5 : 0.15), w: w - 0.36, h: h - (title ? 0.62 : 0.28),
      fontFace: FONT, fontSize: opts.bodySize || 12, color: C.text,
      valign: "top", paraSpaceAfter: 3,
    });
  }
}

// 在文字中标记重点(返回 runs 数组)
// segs: [{t: 文本, key?:true, b?:bold}]
function toRuns(segs, baseSize = 12.5) {
  return segs.map(s => ({
    text: s.t,
    options: {
      fontSize: s.size || baseSize,
      bold: s.b !== undefined ? s.b : !!s.key,
      color: s.key ? C.accent : (s.color || C.text),
    }
  }));
}

// 章节大页
function addSectionPage(slide, sectionNo, sectionTitle, enTitle, points) {
  // 整页深绿背景
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
    fill: { color: C.primary }, line: { type: "none" },
  });
  // 装饰圆（置于右侧，避开左侧文字；越界为满版设计 intentional bleed）
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.2, y: -1.4, w: 3.6, h: 3.6,
    fill: { color: C.green, transparency: 40 }, line: { type: "none" },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.6, y: 4.6, w: 3.6, h: 3.6,
    fill: { color: C.teal, transparency: 55 }, line: { type: "none" },
  });
  // 节编号
  slide.addText(sectionNo, {
    x: 1.0, y: 1.6, w: 4, h: 1.2,
    fontFace: FONT, fontSize: 90, color: C.white, bold: true,
    valign: "middle", transparency: 20,
  });
  // 节标题
  slide.addText(sectionTitle, {
    x: 1.05, y: 2.95, w: 9, h: 0.9,
    fontFace: FONT, fontSize: 40, color: C.white, bold: true,
    valign: "middle",
  });
  // 英文小标题
  slide.addText(enTitle, {
    x: 1.08, y: 3.85, w: 9, h: 0.4,
    fontFace: FONT_EN, fontSize: 15, color: C.divider, italic: true,
    valign: "middle",
  });
  // 横线
  slide.addShape(pptx.ShapeType.line, {
    x: 1.08, y: 4.4, w: 4.5, h: 0,
    line: { color: C.accent, width: 2.5 },
  });
  // 学习要点
  if (points && points.length) {
    const runs = [];
    points.forEach((p, i) => {
      if (i > 0) runs.push({ text: "\n", options: { breakLine: true } });
      runs.push({ text: "▸ ", options: { color: C.accent, bold: true } });
      runs.push({ text: p, options: { color: C.white } });
    });
    slide.addText(runs, {
      x: 1.08, y: 4.7, w: 9, h: 2,
      fontFace: FONT, fontSize: 16, valign: "top", paraSpaceAfter: 6,
    });
  }
}

const TOTAL = 16;
let pageNo = 0;
function next() { pageNo += 1; return pageNo; }

// ============================================================
// Slide 1 — 封面
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bgLight };
  // 左侧深绿色块
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 4.6, h: SLIDE_H,
    fill: { color: C.primary }, line: { type: "none" },
  });
  // 装饰圆
  s.addShape(pptx.ShapeType.ellipse, {
    x: 0.5, y: 5.4, w: 2.2, h: 2.2,
    fill: { color: C.green, transparency: 35 }, line: { type: "none" },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: 3.4, y: -1.3, w: 2.0, h: 2.0,
    fill: { color: C.teal, transparency: 50 }, line: { type: "none" },
  });
  // 章节编号
  s.addText("CHAPTER  01", {
    x: 0.6, y: 1.5, w: 3.8, h: 0.5,
    fontFace: FONT_EN, fontSize: 16, color: C.divider, bold: true,
    charSpacing: 4, valign: "middle",
  });
  s.addText("第 一 章", {
    x: 0.6, y: 2.1, w: 3.8, h: 0.8,
    fontFace: FONT, fontSize: 36, color: C.white, bold: true, valign: "middle",
  });
  s.addShape(pptx.ShapeType.line, {
    x: 0.7, y: 3.0, w: 1.5, h: 0,
    line: { color: C.accent, width: 3 },
  });

  // 右侧主标题区
  s.addText("走 近 细 胞", {
    x: 5.0, y: 1.9, w: 7.8, h: 1.3,
    fontFace: FONT, fontSize: 54, color: C.primary, bold: true, valign: "middle",
  });
  s.addText("Approaching the Cell", {
    x: 5.05, y: 3.15, w: 7.8, h: 0.5,
    fontFace: FONT_EN, fontSize: 18, color: C.teal, italic: true, valign: "middle",
  });
  // 分隔
  s.addShape(pptx.ShapeType.line, {
    x: 5.1, y: 3.85, w: 6.5, h: 0,
    line: { color: C.divider, width: 1.5 },
  });
  // 副信息
  s.addText([
    { text: "教材：", options: { color: C.textMute } },
    { text: "人教版（2019） 生物学 · 必修1", options: { bold: true, color: C.text } },
  ], {
    x: 5.1, y: 4.05, w: 7, h: 0.35,
    fontFace: FONT, fontSize: 14, valign: "middle",
  });
  s.addText([
    { text: "模块：", options: { color: C.textMute } },
    { text: "分子与细胞", options: { bold: true, color: C.text } },
  ], {
    x: 5.1, y: 4.45, w: 7, h: 0.35,
    fontFace: FONT, fontSize: 14, valign: "middle",
  });
  s.addText([
    { text: "适用：", options: { color: C.textMute } },
    { text: "高一上学期 · 教学课件", options: { bold: true, color: C.text } },
  ], {
    x: 5.1, y: 4.85, w: 7, h: 0.35,
    fontFace: FONT, fontSize: 14, valign: "middle",
  });

  // 提示条
  s.addShape(pptx.ShapeType.roundRect, {
    x: 5.1, y: 5.6, w: 7.2, h: 0.7,
    rectRadius: 0.08,
    fill: { color: C.highlight }, line: { color: C.highlightBorder, width: 1.2 },
  });
  s.addText([
    { text: "★ 学习提示  ", options: { bold: true, color: C.accent } },
    { text: "本课件以课标为纲、教材为本，橙色标注为考点重点，红色为易错辨析。", options: { color: C.text } },
  ], {
    x: 5.3, y: 5.6, w: 6.9, h: 0.7,
    fontFace: FONT, fontSize: 12.5, valign: "middle",
  });
}

// ============================================================
// Slide 2 — 本章导读 / 目录
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "本章导读  CONTENTS", "目录与学习目标");
  // 左侧目录
  s.addText("本 章 结 构", {
    x: 0.7, y: 1.35, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.teal, bold: true, valign: "middle",
  });
  const sections = [
    { no: "01", t: "细胞是生命活动的基本单位", d: "细胞学说 · 生命系统层次" },
    { no: "02", t: "细胞的多样性和统一性", d: "原核细胞 · 真核细胞" },
  ];
  sections.forEach((sec, i) => {
    const y = 1.85 + i * 1.25;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7, y, w: 5.7, h: 1.05,
      rectRadius: 0.06,
      fill: { color: C.bgCard }, line: { color: C.green, width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0.7, y, w: 0.06, h: 1.05,
      fill: { color: C.green }, line: { type: "none" },
    });
    s.addText(sec.no, {
      x: 0.95, y, w: 0.85, h: 1.05,
      fontFace: FONT_EN, fontSize: 28, color: C.accent, bold: true, valign: "middle",
    });
    s.addText(sec.t, {
      x: 1.9, y: y + 0.1, w: 4.3, h: 0.45,
      fontFace: FONT, fontSize: 15, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(sec.d, {
      x: 1.9, y: y + 0.55, w: 4.3, h: 0.35,
      fontFace: FONT, fontSize: 11.5, color: C.textMute, valign: "middle",
    });
  });

  // 右侧学习目标
  s.addText("学 习 目 标", {
    x: 7.0, y: 1.35, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.teal, bold: true, valign: "middle",
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.0, y: 1.85, w: 5.65, h: 4.95,
    rectRadius: 0.06,
    fill: { color: C.bgLight }, line: { color: C.divider, width: 1 },
  });
  const goals = [
    "说明细胞是生物体结构和生命活动的基本单位",
    "简述细胞学说的建立过程及其主要内容与意义",
    "概述生命系统的结构层次",
    "使用显微镜观察多种类型的细胞，归纳细胞的多样性与统一性",
    "区别原核细胞与真核细胞，举例说明原核生物",
    "形成结构与功能相适应、进化与适应的生命观念",
  ];
  const gruns = [];
  goals.forEach((g, i) => {
    if (i > 0) gruns.push({ text: "\n", options: { breakLine: true } });
    gruns.push({ text: `${i + 1}. `, options: { bold: true, color: C.accent } });
    gruns.push({ text: g, options: { color: C.text } });
  });
  s.addText(gruns, {
    x: 7.25, y: 2.05, w: 5.2, h: 4.6,
    fontFace: FONT, fontSize: 13, valign: "top", paraSpaceAfter: 8,
  });
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 3 — 第1节 章节页
// ============================================================
{
  const s = pptx.addSlide();
  addSectionPage(s, "01", "细胞是生命活动的基本单位", "The Cell: The Basic Unit of Life", [
    "细胞学说的建立过程与主要内容",
    "细胞是基本的生命系统",
    "生命系统的结构层次",
  ]);
}

// ============================================================
// Slide 4 — 细胞学说的建立过程（时间线）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第1节 · 细胞是生命活动的基本单位", "一、细胞学说的建立过程");
  // 时间线主轴
  const axisY = 3.7;
  s.addShape(pptx.ShapeType.line, {
    x: 0.9, y: axisY, w: 11.55, h: 0,
    line: { color: C.green, width: 2.5 },
  });
  // 端点
  s.addShape(pptx.ShapeType.ellipse, {
    x: 0.82, y: axisY - 0.08, w: 0.16, h: 0.16,
    fill: { color: C.green }, line: { type: "none" },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: 12.38, y: axisY - 0.08, w: 0.16, h: 0.16,
    fill: { color: C.green }, line: { type: "none" },
  });

  const events = [
    { year: "1543", who: "维萨里", what: "《人体的构造》\n从器官水平研究\n人体结构", up: true },
    { year: "1665", who: "罗伯特·胡克", what: "用显微镜观察\n植物木栓，发现并\n命名“细胞”", up: false },
    { year: "1674", who: "列文虎克", what: "用自制显微镜\n观察到了活细胞\n（细菌、红细胞等）", up: true },
    { year: "1838", who: "施莱登", what: "提出植物都是由\n细胞构成的", up: false },
    { year: "1839", who: "施旺", what: "提出动物都是由\n细胞构成的\n（细胞学说诞生）", up: true },
    { year: "1858", who: "魏尔肖", what: "总结出“细胞通过\n分裂产生新细胞”\n完善了细胞学说", up: false },
  ];
  const n = events.length;
  const xStart = 1.4, xSpan = 11.0;
  events.forEach((ev, i) => {
    const cx = xStart + (xSpan / (n - 1)) * i;
    // 节点圆
    s.addShape(pptx.ShapeType.ellipse, {
      x: cx - 0.09, y: axisY - 0.09, w: 0.18, h: 0.18,
      fill: { color: C.accent }, line: { color: C.white, width: 1.5 },
    });
    // 连接竖线
    if (ev.up) {
      s.addShape(pptx.ShapeType.line, {
        x: cx, y: axisY - 1.1, w: 0, h: 1.1,
        line: { color: C.divider, width: 1.2 },
      });
    } else {
      s.addShape(pptx.ShapeType.line, {
        x: cx, y: axisY, w: 0, h: 1.1,
        line: { color: C.divider, width: 1.2 },
      });
    }
    // 卡片
    const cw = 1.78, ch = 1.05;
    const cy = ev.up ? axisY - 1.1 - ch : axisY + 1.1;
    s.addShape(pptx.ShapeType.roundRect, {
      x: cx - cw / 2, y: cy, w: cw, h: ch,
      rectRadius: 0.05,
      fill: { color: C.bgCard }, line: { color: C.green, width: 1 },
    });
    // 年份
    s.addText(ev.year, {
      x: cx - cw / 2, y: cy + 0.04, w: cw, h: 0.28,
      fontFace: FONT_EN, fontSize: 14, color: C.accent, bold: true,
      align: "center", valign: "middle",
    });
    // 人物
    s.addText(ev.who, {
      x: cx - cw / 2, y: cy + 0.3, w: cw, h: 0.26,
      fontFace: FONT, fontSize: 12.5, color: C.primary, bold: true,
      align: "center", valign: "middle",
    });
    // 贡献
    s.addText(ev.what, {
      x: cx - cw / 2 + 0.05, y: cy + 0.56, w: cw - 0.1, h: 0.46,
      fontFace: FONT, fontSize: 9.5, color: C.textSoft,
      align: "center", valign: "top", lineSpacingMultiple: 1.0,
    });
  });
  // 底部小结
  addKeyPointBox(s, 0.7, 6.05, 11.95, 0.9, "规律", [
    { text: "细胞学说是科学家用显微镜观察、归纳推理逐步建立的；其核心奠基人是施莱登和施旺，魏尔肖加以完善。", bold: true },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 5 — 细胞学说的主要内容（重点）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第1节 · 细胞是生命活动的基本单位", "二、细胞学说的主要内容");

  const items = [
    {
      no: "01", t: "细胞是一个有机体",
      d: "一切动植物都是由细胞和细胞产物所构成。",
      key: true,
    },
    {
      no: "02", t: "细胞是基本的生命系统",
      d: "细胞是一个有机体，它不仅本身是生命系统，而且所有生物都以细胞为基本的结构和功能单位。",
      key: true,
    },
    {
      no: "03", t: "新细胞由老细胞产生",
      d: "细胞通过分裂产生新细胞（魏尔肖补充）。",
      key: true,
    },
  ];
  items.forEach((it, i) => {
    const x = 0.7 + i * 4.15;
    const w = 3.95, h = 3.4;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.5, w, h,
      rectRadius: 0.08,
      fill: { color: C.bgLight },
      line: { color: it.key ? C.accent : C.green, width: it.key ? 1.8 : 1 },
    });
    // 顶部色块
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.5, w, h: 0.7,
      rectRadius: 0.08,
      fill: { color: it.key ? C.accent : C.green }, line: { type: "none" },
    });
    s.addText("要点 " + it.no, {
      x, y: 1.5, w, h: 0.7,
      fontFace: FONT, fontSize: 15, color: C.white, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(it.t, {
      x: x + 0.2, y: 2.4, w: w - 0.4, h: 0.5,
      fontFace: FONT, fontSize: 16, color: C.primary, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(it.d, {
      x: x + 0.25, y: 3.0, w: w - 0.5, h: 1.4,
      fontFace: FONT, fontSize: 12.5, color: C.text,
      align: "center", valign: "top", lineSpacingMultiple: 1.15,
    });
    if (it.key) {
      s.addText("★ 重点", {
        x: x + w - 1.1, y: 1.5 + 3.4 - 0.35, w: 1.0, h: 0.28,
        fontFace: FONT, fontSize: 10, color: C.accent, bold: true,
        align: "right", valign: "middle",
      });
    }
  });

  // 下方解读
  addKeyPointBox(s, 0.7, 5.15, 11.95, 1.75, "理解", [
    { text: "细胞学说揭示了", },
    { text: "动植物结构的统一性", bold: true, color: C.accent },
    { text: "和生物界的统一性，阐明了", },
    { text: "生物界的统一性来自细胞的统一性", bold: true, color: C.accent },
    { text: "。但细胞学说并未说明细胞的来源（细胞如何产生）——这一点由魏尔肖“细胞分裂”加以补充。", },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 6 — 细胞学说的意义 + 细胞概念
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第1节 · 细胞是生命活动的基本单位", "三、细胞学说的意义");

  // 左：意义
  s.addText("细胞学说的意义", {
    x: 0.7, y: 1.35, w: 6, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.teal, bold: true, valign: "middle",
  });
  const sig = [
    { t: "揭示统一性", d: "揭示了动物和植物都由细胞构成，打破了动植物之间的壁垒，揭示了生物界的统一性。" },
    { t: "奠基细胞水平", d: "标志着生物学的研究进入细胞水平，为后来进入分子水平打下基础。" },
    { t: "促进进化论", d: "为达尔文生物进化论的确立奠定了基础（统一性暗示共同祖先）。" },
    { t: "方法论意义", d: "体现了“观察—归纳—推理”的科学方法，是科学史上的重要里程碑。" },
  ];
  sig.forEach((it, i) => {
    const y = 1.85 + i * 1.18;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7, y, w: 6.1, h: 1.05,
      rectRadius: 0.06,
      fill: { color: C.bgCard }, line: { color: C.green, width: 0.8 },
    });
    s.addText(String(i + 1), {
      x: 0.85, y: y + 0.15, w: 0.55, h: 0.55,
      fontFace: FONT_EN, fontSize: 20, color: C.accent, bold: true, valign: "middle",
    });
    s.addText(it.t, {
      x: 1.5, y: y + 0.1, w: 5.1, h: 0.38,
      fontFace: FONT, fontSize: 14, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(it.d, {
      x: 1.5, y: y + 0.48, w: 5.15, h: 0.5,
      fontFace: FONT, fontSize: 11.5, color: C.textSoft, valign: "top",
    });
  });

  // 右：科学史地位
  s.addText("科学史地位", {
    x: 7.1, y: 1.35, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.teal, bold: true, valign: "middle",
  });
  addCard(s, 7.1, 1.85, 5.55, 2.5, "现代生物学三大基石之一",
    [
      { text: "细胞学说", options: { bold: true, color: C.accent } },
      { text: "（1838—1839）", options: { color: C.textMute } },
      { text: "\n", options: { breakLine: true } },
      { text: "进化论（达尔文，1859）", options: {} },
      { text: "\n", options: { breakLine: true } },
      { text: "孟德尔遗传定律（1866）", options: {} },
    ],
    { accent: C.teal, bodySize: 13 }
  );
  addKeyPointBox(s, 7.1, 4.5, 5.55, 2.2, "考点", [
    { text: "细胞学说的创立者：", bold: true },
    { text: "施莱登、施旺", key: true },
    { text: "（不是列文虎克、不是胡克）。\n", },
    { text: "“细胞分裂产生新细胞”由", },
    { text: "魏尔肖", key: true },
    { text: "提出（1858）。", },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 7 — 细胞是基本的生命系统
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第1节 · 细胞是生命活动的基本单位", "四、细胞是基本的生命系统");

  s.addText("生命活动离不开细胞——从三个层次理解", {
    x: 0.7, y: 1.3, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 15, color: C.teal, bold: true, valign: "middle",
  });

  const cols = [
    {
      t: "病毒",
      sub: "无细胞结构",
      d: "病毒没有细胞结构，只有依赖活细胞才能生活，以复制方式增殖。例如：新冠病毒、噬菌体、烟草花叶病毒等。",
      ex: "病毒必须寄生在活细胞内",
    },
    {
      t: "单细胞生物",
      sub: "一个细胞完成全部生命活动",
      d: "单细胞生物依靠单个细胞就能完成摄食、运动、分裂、排泄、呼吸等全部生命活动。例如：草履虫、变形虫、酵母菌、细菌（大肠杆菌）。",
      ex: "一个细胞 = 一个生物体",
    },
    {
      t: "多细胞生物",
      sub: "依赖细胞密切合作",
      d: "多细胞生物依赖各种分化的细胞密切合作，共同完成一系列复杂的生命活动。例如：缩手反射、繁殖、生长、免疫等。",
      ex: "细胞分化 → 协作",
    },
  ];
  cols.forEach((c, i) => {
    const x = 0.7 + i * 4.15;
    const w = 3.95;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.85, w, h: 4.0,
      rectRadius: 0.08,
      fill: { color: C.bgLight }, line: { color: C.green, width: 1 },
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.85, w, h: 0.85,
      rectRadius: 0.08,
      fill: { color: C.green }, line: { type: "none" },
    });
    s.addText(c.t, {
      x: x + 0.2, y: 1.92, w: w - 0.4, h: 0.45,
      fontFace: FONT, fontSize: 17, color: C.white, bold: true, valign: "middle",
    });
    s.addText(c.sub, {
      x: x + 0.2, y: 2.36, w: w - 0.4, h: 0.3,
      fontFace: FONT, fontSize: 11.5, color: C.divider, valign: "middle",
    });
    s.addText(c.d, {
      x: x + 0.22, y: 2.9, w: w - 0.44, h: 2.0,
      fontFace: FONT, fontSize: 12, color: C.text, valign: "top", lineSpacingMultiple: 1.15,
    });
    // 例
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: 5.35, w: w - 0.4, h: 0.4,
      rectRadius: 0.04,
      fill: { color: C.highlight }, line: { color: C.highlightBorder, width: 1 },
    });
    s.addText([
      { text: "★ ", options: { color: C.accent, bold: true } },
      { text: c.ex, options: { color: C.text, bold: true } },
    ], {
      x: x + 0.25, y: 5.35, w: w - 0.5, h: 0.4,
      fontFace: FONT, fontSize: 11.5, valign: "middle",
    });
  });
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 8 — 生命系统的结构层次
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第1节 · 细胞是生命活动的基本单位", "五、生命系统的结构层次");

  s.addText("由微观到宏观：细胞 → …… → 生物圈", {
    x: 0.7, y: 1.3, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 14.5, color: C.teal, bold: true, valign: "middle",
  });

  const levels = [
    { t: "细胞", en: "Cell", d: "生命系统的最基本结构层次" },
    { t: "组织", en: "Tissue", d: "形态相似、结构功能相同的细胞群" },
    { t: "器官", en: "Organ", d: "不同组织按一定次序结合" },
    { t: "系统", en: "System", d: "共同完成一种或几种生理功能的器官组合（植物无此层次）" },
    { t: "个体", en: "Individual", d: "具有繁殖、代谢等完整生命活动的生物体" },
    { t: "种群", en: "Population", d: "同种生物个体的总和（同时间、同地域、同种）" },
    { t: "群落", en: "Community", d: "一定区域中所有种群的总和" },
    { t: "生态系统", en: "Ecosystem", d: "生物群落 + 无机环境相互作用形成的统一整体" },
    { t: "生物圈", en: "Biosphere", d: "地球上最大的生态系统，最宏观的生命系统" },
  ];
  // 流程卡片
  const yTop = 1.95;
  const cardW = 1.27, cardH = 1.5;
  const gap = 0.135;
  const startX = 0.7;
  levels.forEach((lv, i) => {
    const x = startX + i * (cardW + gap);
    const isCell = i === 0;
    const isMax = i === levels.length - 1;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: yTop, w: cardW, h: cardH,
      rectRadius: 0.06,
      fill: { color: isCell ? C.accent : (isMax ? C.primary : C.bgCard) },
      line: { color: isCell ? C.accent : C.green, width: 1 },
    });
    s.addText(lv.t, {
      x, y: yTop + 0.15, w: cardW, h: 0.4,
      fontFace: FONT, fontSize: 15, color: (isCell || isMax) ? C.white : C.primary, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(lv.en, {
      x, y: yTop + 0.55, w: cardW, h: 0.25,
      fontFace: FONT_EN, fontSize: 9, color: (isCell || isMax) ? C.divider : C.teal, italic: true,
      align: "center", valign: "middle",
    });
    s.addText(lv.d, {
      x: x + 0.04, y: yTop + 0.85, w: cardW - 0.08, h: 0.6,
      fontFace: FONT, fontSize: 8.5, color: (isCell || isMax) ? C.white : C.textSoft,
      align: "center", valign: "top", lineSpacingMultiple: 1.0,
    });
    // 箭头
    if (i < levels.length - 1) {
      const ax = x + cardW;
      s.addText("→", {
        x: ax, y: yTop + cardH / 2 - 0.18, w: gap, h: 0.36,
        fontFace: FONT, fontSize: 14, color: C.green, bold: true,
        align: "center", valign: "middle",
      });
    }
  });

  // 重点提示框
  addKeyPointBox(s, 0.7, 3.95, 6.0, 2.85, "重点", [
    { text: "生命系统的最基本层次是", },
    { text: "细胞", key: true },
    { text: "。\n", },
    { text: "最大、最宏观的生命系统是", },
    { text: "生物圈", key: true },
    { text: "。\n", },
    { text: "单细胞生物（如草履虫）的层次：", bold: true },
    { text: "细胞 → 个体", key: true },
    { text: "（无组织、器官层次）。\n", },
    { text: "植物的生命系统层次：", bold: true },
    { text: "无“系统”", key: true },
    { text: "层次，器官直接构成个体。", },
  ]);
  addKeyPointBox(s, 6.95, 3.95, 5.7, 2.85, "易混辨析", [
    { text: "种群", key: true },
    { text: " vs ", },
    { text: "群落", key: true },
    { text: " vs ", },
    { text: "生态系统", key: true },
    { text: "：\n", },
    { text: "种群", bold: true },
    { text: "＝ 同种生物的所有个体（如一个池塘里所有的鲤鱼）。\n", },
    { text: "群落", bold: true },
    { text: "＝ 一定区域所有种群的总和（池塘里所有生物）。\n", },
    { text: "生态系统", bold: true },
    { text: "＝ 群落 + 无机环境（整个池塘及其环境）。", },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 9 — 第2节 章节页
// ============================================================
{
  const s = pptx.addSlide();
  addSectionPage(s, "02", "细胞的多样性和统一性", "Diversity and Unity of Cells", [
    "观察细胞：显微镜的使用",
    "原核细胞与真核细胞",
    "细胞的多样性与统一性",
  ]);
}

// ============================================================
// Slide 10 — 观察细胞 & 显微镜
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第2节 · 细胞的多样性和统一性", "一、观察细胞（显微镜下的世界）");

  // 左：发展史
  s.addText("显微镜的发展", {
    x: 0.7, y: 1.35, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 15, color: C.teal, bold: true, valign: "middle",
  });
  const micro = [
    { y: "约1590", t: "詹森父子", d: "制造出第一台复式显微镜" },
    { y: "1665", t: "罗伯特·胡克", d: "观察木栓薄片，发现并命名“cell”" },
    { y: "1674", t: "列文虎克", d: "自制高倍显微镜，观察活细胞" },
    { y: "1931", t: "鲁斯卡等", d: "发明电子显微镜，突破0.2μm极限" },
    { y: "1981", t: "宾尼等", d: "发明扫描隧道显微镜，可观察原子级" },
  ];
  micro.forEach((m, i) => {
    const y = 1.85 + i * 0.92;
    s.addShape(pptx.ShapeType.line, {
      x: 1.0, y: y + 0.45, w: 0.25, h: 0,
      line: { color: C.green, width: 1 },
    });
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.93, y: y + 0.38, w: 0.16, h: 0.16,
      fill: { color: C.accent }, line: { color: C.white, width: 1 },
    });
    s.addText(m.y, {
      x: 1.3, y, w: 1.4, h: 0.32,
      fontFace: FONT_EN, fontSize: 12, color: C.accent, bold: true, valign: "middle",
    });
    s.addText(m.t, {
      x: 2.75, y, w: 2.0, h: 0.32,
      fontFace: FONT, fontSize: 12.5, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(m.d, {
      x: 1.3, y: y + 0.33, w: 5.0, h: 0.35,
      fontFace: FONT, fontSize: 11, color: C.textSoft, valign: "middle",
    });
  });

  // 右：分类依据
  s.addText("细胞分类的依据", {
    x: 7.1, y: 1.35, w: 5, h: 0.4,
    fontFace: FONT, fontSize: 15, color: C.teal, bold: true, valign: "middle",
  });
  addCard(s, 7.1, 1.85, 5.55, 2.1, "核心依据",
    [
      { text: "以", options: {} },
      { text: "核膜", options: { bold: true, color: C.accent } },
      { text: "为界限的细胞核的有无", options: { bold: true, color: C.accent } },
      { text: "，将细胞分为：", options: {} },
      { text: "\n\n", options: { breakLine: true } },
      { text: "① 真核细胞", options: { bold: true, color: C.primary } },
      { text: "：有核膜包被的成形的细胞核。\n", options: {} },
      { text: "② 原核细胞", options: { bold: true, color: C.primary } },
      { text: "：无核膜，无成形细胞核（只有拟核/核区）。", options: {} },
    ],
    { accent: C.teal, bodySize: 12.5 }
  );

  addKeyPointBox(s, 7.1, 4.1, 5.55, 2.6, "记忆口诀", [
    { text: "“有无核膜”", key: true },
    { text: "是区分原核/真核的关键，不是看：\n", },
    { text: "  ✗ 有无细胞壁（植物、真菌、细菌都有）\n", color: C.red },
    { text: "  ✗ 有无 DNA（所有细胞都有 DNA）\n", color: C.red },
    { text: "  ✗ 有无核糖体（原核、真核都有）\n", color: C.red },
    { text: "  ✗ 细胞大小（虽有差异但不是分类依据）", color: C.red },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 11 — 原核细胞 vs 真核细胞 对比（重点）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第2节 · 细胞的多样性和统一性", "二、原核细胞与真核细胞的比较");

  // 表格
  const rows = [
    [
      { text: "比较项", options: { bold: true, color: C.white, fill: { color: C.primary } } },
      { text: "原核细胞", options: { bold: true, color: C.white, fill: { color: C.green } } },
      { text: "真核细胞", options: { bold: true, color: C.white, fill: { color: C.teal } } },
    ],
    [
      { text: "细胞大小", options: { bold: true } },
      { text: "较小（1~10 μm）" },
      { text: "较大（10~100 μm）" },
    ],
    [
      { text: "细胞核", options: { bold: true, color: C.accent } },
      { text: "无核膜，无核仁\n（只有拟核/核区）", options: { color: C.accent, bold: true } },
      { text: "有核膜、核仁\n成形的细胞核", options: { color: C.accent, bold: true } },
    ],
    [
      { text: "DNA 存在形式", options: { bold: true, color: C.accent } },
      { text: "裸露的环状 DNA\n（无染色体）", options: { color: C.accent, bold: true } },
      { text: "DNA + 蛋白质\n构成染色体", options: { color: C.accent, bold: true } },
    ],
    [
      { text: "细胞器", options: { bold: true } },
      { text: "只有核糖体（一种）" },
      { text: "有多种细胞器（线粒体、叶绿体、内质网等）" },
    ],
    [
      { text: "细胞壁", options: { bold: true } },
      { text: "有（主要成分是肽聚糖）" },
      { text: "植物细胞有（纤维素、果胶）；动物细胞无" },
    ],
    [
      { text: "代表生物", options: { bold: true } },
      { text: "蓝细菌、细菌、支原体、放线菌" },
      { text: "植物、动物、真菌、原生生物" },
    ],
  ];
  s.addTable(rows, {
    x: 0.7, y: 1.4, w: 11.95,
    colW: [2.5, 4.7, 4.75],
    fontFace: FONT, fontSize: 12,
    color: C.text,
    border: { type: "solid", color: C.divider, pt: 1 },
    rowH: [0.5, 0.55, 0.75, 0.75, 0.55, 0.65, 0.6],
    align: "left", valign: "middle",
    margin: [3, 8, 3, 8],
  });

  // 底部：统一性 + 多样性
  addCard(s, 0.7, 5.55, 5.85, 1.35, "统一性（共同点）",
    [
      { text: "都有 ", options: {} },
      { text: "细胞膜、细胞质、核糖体", options: { bold: true, color: C.accent } },
      { text: "；遗传物质都是 ", options: {} },
      { text: "DNA", options: { bold: true, color: C.accent } },
      { text: "。", options: {} },
    ],
    { accent: C.green, bodySize: 12 }
  );
  addCard(s, 6.8, 5.55, 5.85, 1.35, "多样性（不同点）",
    [
      { text: "细胞核的有无、DNA 存在形式、细胞器种类、细胞壁成分等不同，体现", },
      { text: "结构多样性", options: { bold: true, color: C.accent } },
      { text: "。", },
    ],
    { accent: C.teal, bodySize: 12 }
  );
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 12 — 常见原核生物（重点-易混）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第2节 · 细胞的多样性和统一性", "三、常见的原核生物（重点 · 易混）");

  s.addText("原核生物 = 蓝细菌 + 细菌 + 放线菌 + 支原体 + 衣原体 + 立克次氏体", {
    x: 0.7, y: 1.3, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.teal, bold: true, valign: "middle",
  });

  // 四大类
  const groups = [
    {
      t: "蓝细菌（蓝藻）", en: "Cyanobacteria",
      d: "含叶绿素和藻蓝素，能进行光合作用（自养）。",
      ex: "颤藻、蓝球藻、发菜、念珠藻",
      self: true,
    },
    {
      t: "细菌", en: "Bacteria",
      d: "多数营腐生或寄生生活（异养）。形态分球菌、杆菌、螺旋菌。",
      ex: "大肠杆菌、乳酸菌、硝化细菌、根瘤菌",
      self: false,
    },
    {
      t: "放线菌", en: "Actinomycetes",
      d: "菌丝状原核生物，是抗生素的重要来源。",
      ex: "链霉菌（产生链霉素）",
      self: false,
    },
    {
      t: "支原体/衣原体/立克次氏体", en: "Mycoplasma etc.",
      d: "营细胞内寄生（最小的原核生物是支原体，无细胞壁）。",
      ex: "肺炎支原体、沙眼衣原体",
      self: false,
    },
  ];
  groups.forEach((g, i) => {
    const x = 0.7 + (i % 2) * 6.2;
    const y = 1.78 + Math.floor(i / 2) * 1.78;
    const w = 5.95, h = 1.65;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      rectRadius: 0.06,
      fill: { color: C.bgCard }, line: { color: C.green, width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y, w: 0.08, h,
      fill: { color: g.self ? C.accent : C.green }, line: { type: "none" },
    });
    s.addText(g.t, {
      x: x + 0.25, y: y + 0.1, w: 4.3, h: 0.34,
      fontFace: FONT, fontSize: 14.5, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(g.en, {
      x: x + 4.6, y: y + 0.12, w: 1.2, h: 0.3,
      fontFace: FONT_EN, fontSize: 9, color: C.teal, italic: true, align: "right", valign: "middle",
    });
    s.addText(g.d, {
      x: x + 0.25, y: y + 0.46, w: w - 0.45, h: 0.48,
      fontFace: FONT, fontSize: 11.5, color: C.textSoft, valign: "top", lineSpacingMultiple: 1.1,
    });
    // 举例
    s.addText([
      { text: "举例：", options: { bold: true, color: C.green } },
      { text: g.ex, options: { color: C.text, bold: true } },
    ], {
      x: x + 0.25, y: y + 1.12, w: w - 0.45, h: 0.36,
      fontFace: FONT, fontSize: 11.5, valign: "middle",
    });
  });

  // 易错警示（标题色块与"! 易错"文字为徽章设计 intentional overlap）
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 5.5, w: 11.95, h: 1.4,
    rectRadius: 0.06,
    fill: { color: "FFEBEE" }, line: { color: C.red, width: 1.5 },
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 5.5, w: 1.4, h: 0.42,
    rectRadius: 0.06,
    fill: { color: C.red }, line: { type: "none" },
  });
  s.addText("! 易错", {
    x: 0.7, y: 5.5, w: 1.4, h: 0.42,
    fontFace: FONT, fontSize: 12, color: C.white, bold: true,
    align: "center", valign: "middle",
  });
  s.addText([
    { text: "下列都是", options: {} },
    { text: "真核生物", options: { bold: true, color: C.red } },
    { text: "（勿误认为原核生物）：", options: {} },
    { text: "酵母菌、霉菌、蘑菇（真菌）；", options: { bold: true, color: C.accent } },
    { text: "变形虫、草履虫、疟原虫（原生动物）；", options: { bold: true, color: C.accent } },
    { text: "衣藻、水绵、海带（藻类）。\n", options: { bold: true, color: C.accent } },
    { text: "口诀：带“菌”不一定是原核（真菌为真核）；带“藻”不一定是蓝藻（绿藻/红藻/褐藻为真核）。", options: { color: C.textSoft } },
  ], {
    x: 0.9, y: 5.96, w: 11.55, h: 0.88,
    fontFace: FONT, fontSize: 11.5, valign: "top", lineSpacingMultiple: 1.15,
  });
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 13 — 细胞的多样性与统一性（小结）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "第2节 · 细胞的多样性和统一性", "四、细胞的多样性与统一性");

  // 左：多样性
  addCard(s, 0.7, 1.45, 5.9, 3.1, "细胞的多样性",
    [
      { text: "表现：\n", options: { bold: true, color: C.primary } },
      { text: "① 形态多样：", options: { bold: true } },
      { text: "红细胞呈双凹圆饼状、神经细胞有长突起、肌肉细胞细长等。\n\n", options: {} },
      { text: "② 结构多样：", options: { bold: true } },
      { text: "原核细胞与真核细胞结构不同；植物细胞有细胞壁、叶绿体，动物细胞没有。\n\n", options: {} },
      { text: "③ 功能多样：", options: { bold: true } },
      { text: "红细胞运输氧气、神经细胞传导兴奋、肌肉细胞收缩等。\n\n", options: {} },
      { text: "④ 类型多样：", options: { bold: true } },
      { text: "原核细胞、真核细胞两大类，每一类又包含众多生物类群。", options: {} },
    ],
    { accent: C.teal, bodySize: 12 }
  );

  // 右：统一性
  addCard(s, 6.75, 1.45, 5.9, 3.1, "细胞的统一性",
    [
      { text: "表现：\n", options: { bold: true, color: C.primary } },
      { text: "① 基本结构统一：", options: { bold: true } },
      { text: "都有细胞膜、细胞质、核糖体。\n\n", options: {} },
      { text: "② 遗传物质统一：", options: { bold: true } },
      { text: "都以 DNA 作为遗传物质。\n\n", options: {} },
      { text: "③ 组成物质统一：", options: { bold: true } },
      { text: "都以蛋白质、核酸等生物大分子作为生命活动的基础。\n\n", options: {} },
      { text: "④ 能量统一：", options: { bold: true } },
      { text: "细胞代谢都以 ATP 作为直接能源物质。\n\n", options: {} },
      { text: "⑤ 中心法则统一：", options: { bold: true } },
      { text: "都遵循遗传信息的传递与表达规律。", options: {} },
    ],
    { accent: C.green, bodySize: 12 }
  );

  // 下方：关系
  addKeyPointBox(s, 0.7, 4.75, 11.95, 2.0, "辩证关系", [
    { text: "多样性与统一性是辩证统一的：", bold: true },
    { text: "统一性", key: true },
    { text: "体现所有细胞具有共同起源（生命同源），反映生物界的", },
    { text: "共同性", key: true },
    { text: "；", },
    { text: "\n", options: { breakLine: true } },
    { text: "多样性", key: true },
    { text: "体现细胞在长期进化中产生了适应性分化，反映生物界的", },
    { text: "差异性", key: true },
    { text: "。两者共同支持了 ", },
    { text: "“结构与功能相适应”", key: true },
    { text: " 和 ", },
    { text: "“生物进化”", key: true },
    { text: " 的生命观念。", },
  ]);
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 14 — 本章重点知识总结（一）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "本章重点  KEY POINTS  ·  1/2", "重点知识总结（一）");

  const kp = [
    {
      t: "细胞学说的三点内容",
      d: "① 一切动植物由细胞和细胞产物构成；② 细胞是基本的生命系统；③ 新细胞由老细胞产生（魏尔肖）。",
      tag: "必背",
    },
    {
      t: "细胞学说的意义",
      d: "揭示生物界统一性；标志生物学进入细胞水平；为进化论奠定基础；体现观察—归纳—推理的科学方法。",
      tag: "理解",
    },
    {
      t: "生命活动离不开细胞",
      d: "病毒依赖活细胞；单细胞生物一个细胞完成全部生命活动；多细胞生物依赖分化细胞密切合作。",
      tag: "理解",
    },
    {
      t: "生命系统的结构层次",
      d: "细胞→组织→器官→系统→个体→种群→群落→生态系统→生物圈。基本层次是细胞，最大是生物圈。植物无“系统”层次。",
      tag: "必背",
    },
  ];
  kp.forEach((k, i) => {
    const x = 0.7 + (i % 2) * 6.2;
    const y = 1.4 + Math.floor(i / 2) * 1.8;
    const w = 5.95, h = 1.65;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      rectRadius: 0.06,
      fill: { color: C.bgLight }, line: { color: C.accent, width: 1.3 },
    });
    // 标签
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + w - 1.0, y: y + 0.1, w: 0.85, h: 0.34,
      rectRadius: 0.04,
      fill: { color: k.tag === "必背" ? C.accent : C.teal }, line: { type: "none" },
    });
    s.addText(k.tag, {
      x: x + w - 1.0, y: y + 0.1, w: 0.85, h: 0.34,
      fontFace: FONT, fontSize: 10, color: C.white, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(k.t, {
      x: x + 0.2, y: y + 0.12, w: w - 1.3, h: 0.4,
      fontFace: FONT, fontSize: 14.5, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(k.d, {
      x: x + 0.22, y: y + 0.6, w: w - 0.42, h: 0.95,
      fontFace: FONT, fontSize: 12, color: C.text, valign: "top", lineSpacingMultiple: 1.15,
    });
  });
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 15 — 本章重点知识总结（二）
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "本章重点  KEY POINTS  ·  2/2", "重点知识总结（二）");

  const kp = [
    {
      t: "原核细胞与真核细胞的根本区别",
      d: "有无以核膜为界限的细胞核。原核只有拟核（裸露环状 DNA），真核有成形的细胞核（有核膜、核仁，DNA+蛋白质构成染色体）。",
      tag: "必背",
    },
    {
      t: "原核生物类群",
      d: "蓝细菌（颤藻、蓝球藻、发菜、念珠藻）、细菌（大肠杆菌、乳酸菌）、放线菌、支原体（最小，无细胞壁）、衣原体、立克次氏体。",
      tag: "必背",
    },
    {
      t: "蓝细菌能光合作用的原因",
      d: "含叶绿素和藻蓝素，能进行光合作用（自养），但无叶绿体！叶绿体只存在于真核细胞中。",
      tag: "易错",
    },
    {
      t: "细胞多样性与统一性",
      d: "多样性：形态、结构、功能、类型多样；统一性：都有细胞膜、细胞质、核糖体，遗传物质都是 DNA。两者辩证统一。",
      tag: "理解",
    },
  ];
  kp.forEach((k, i) => {
    const x = 0.7 + (i % 2) * 6.2;
    const y = 1.4 + Math.floor(i / 2) * 1.8;
    const w = 5.95, h = 1.65;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      rectRadius: 0.06,
      fill: { color: C.bgLight }, line: { color: k.tag === "易错" ? C.red : C.accent, width: 1.3 },
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + w - 1.0, y: y + 0.1, w: 0.85, h: 0.34,
      rectRadius: 0.04,
      fill: { color: k.tag === "必背" ? C.accent : (k.tag === "易错" ? C.red : C.teal) }, line: { type: "none" },
    });
    // 标签文字叠在色块上（intentional badge overlap）
    s.addText(k.tag, {
      x: x + w - 1.0, y: y + 0.1, w: 0.85, h: 0.34,
      fontFace: FONT, fontSize: 10, color: C.white, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(k.t, {
      x: x + 0.2, y: y + 0.12, w: w - 1.3, h: 0.4,
      fontFace: FONT, fontSize: 14.5, color: C.primary, bold: true, valign: "middle",
    });
    s.addText(k.d, {
      x: x + 0.22, y: y + 0.6, w: w - 0.42, h: 0.95,
      fontFace: FONT, fontSize: 12, color: C.text, valign: "top", lineSpacingMultiple: 1.15,
    });
  });
  addFooter(s, next(), TOTAL);
}

// ============================================================
// Slide 16 — 思考与练习 / 结束
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "本 章 检 测  ·  ASSESSMENT", "思考与练习");

  const qs = [
    "1. 恩格斯把细胞学说列为 19 世纪自然科学的三大发现之一。细胞学说最重要的意义是什么？",
    "2. 病毒没有细胞结构，为什么它仍属于生物？它如何繁殖？",
    "3. 生命系统的结构层次中，为什么说“细胞”是最基本的生命系统？",
    "4. 草履虫与大肠杆菌在生命系统层次上有何不同？分别属于原核还是真核生物？",
    "5. 如何用最简单的方法区分一个未知的单细胞生物是原核还是真核？",
    "6. 蓝细菌没有叶绿体，为什么能进行光合作用？这说明什么？",
  ];
  const qruns = [];
  qs.forEach((q, i) => {
    if (i > 0) qruns.push({ text: "\n", options: { breakLine: true } });
    qruns.push({ text: q, options: { color: C.text, paraSpaceAfter: 8 } });
  });
  s.addText(qruns, {
    x: 0.7, y: 1.4, w: 8.4, h: 5.3,
    fontFace: FONT, fontSize: 13.5, valign: "top", paraSpaceAfter: 8, lineSpacingMultiple: 1.2,
  });

  // 右侧结语
  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.35, y: 1.4, w: 3.3, h: 5.3,
    rectRadius: 0.08,
    fill: { color: C.primary }, line: { type: "none" },
  });
  s.addText("结  语", {
    x: 9.55, y: 1.7, w: 2.9, h: 0.5,
    fontFace: FONT, fontSize: 20, color: C.white, bold: true, align: "center", valign: "middle",
  });
  s.addShape(pptx.ShapeType.line, {
    x: 10.4, y: 2.25, w: 1.2, h: 0,
    line: { color: C.accent, width: 2 },
  });
  s.addText([
    { text: "细胞——\n", options: { color: C.divider } },
    { text: "生命活动的基本单位\n", options: { color: C.white, bold: true, fontSize: 16 } },
    { text: "与生命系统的最基本层次。\n\n", options: { color: C.divider, fontSize: 12 } },
    { text: "从细胞出发，\n", options: { color: C.white, fontSize: 13 } },
    { text: "理解生命系统的\n", options: { color: C.white, fontSize: 13 } },
    { text: "结构与层次，\n", options: { color: C.white, fontSize: 13 } },
    { text: "开启分子与细胞\n", options: { color: C.white, fontSize: 13 } },
    { text: "的探索之旅。", options: { color: C.white, fontSize: 13 } },
  ], {
    x: 9.6, y: 2.5, w: 2.85, h: 3.2,
    fontFace: FONT, valign: "top", align: "center", lineSpacingMultiple: 1.25,
  });
  s.addText("— THE END —", {
    x: 9.55, y: 5.95, w: 2.9, h: 0.4,
    fontFace: FONT_EN, fontSize: 11, color: C.accent, bold: true, align: "center", valign: "middle",
  });
  addFooter(s, next(), TOTAL);
}

// ============ 校验 ============
pptx._slides.forEach((slide) => {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true, ignoreDecorativeShapes: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
});

// ============ 输出 ============
const OUT = "高一生物_第一章_走近细胞.pptx";
pptx.writeFile({ fileName: OUT }).then((f) => {
  console.log("已生成:", f);
});
