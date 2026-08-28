const app = document.querySelector('#app');
const securityHomeRoot = document.querySelector('#security-home-root');
const managementRoot = document.querySelector('#management-root');
const tvStage = document.querySelector('#tv-stage');
const modalRoot = document.querySelector('#modal-root');
const toastRoot = document.querySelector('#toast-root');
const pageTitle = document.querySelector('#page-title');
const pageSubtitle = document.querySelector('#page-subtitle');
const eyebrow = document.querySelector('#eyebrow');
const networkControl = document.querySelector('#network-toggle');
const networkStatus = document.querySelector('#network-status');
const networkStatusDot = document.querySelector('.network-status-dot');

const data = await fetch('./data/quality-menu-parameters.json').then((response) => response.json());
const parameters = data.items;

const state = {
  page: 'home',
  inputSource: 'HDMI 1',
  signal: 'HDR',
  mode: 'TSR鲜艳',
  draftName: '我的夜间影院',
  importedCode: '',
  libraryTab: '全部',
  selectedRecipe: null,
  focusKey: null,
  previousFocusElement: null,
  previousFocusKey: null,
  busy: false,
  privacyChecked: false,
  networkAvailable: localStorage.getItem('tcl-picture-network') !== 'offline',
  appliedContexts: JSON.parse(localStorage.getItem('tcl-picture-applied-contexts') || '{}'),
  cloudRecipes: JSON.parse(localStorage.getItem('tcl-picture-cloud-recipes') || '{}'),
  recipes: JSON.parse(localStorage.getItem('tcl-picture-recipes') || 'null') || [
    { id: 'r1', name: '主机游戏 HDR', inputSource: 'HDMI 1', signal: 'HDR', mode: '游戏', source: '我创建的', created: '今天 14:25', visual: 'hdr', current: true },
    { id: 'r2', name: '周末影院', inputSource: 'HDMI 2', signal: 'SDR', mode: '电影/图片', source: '我创建的', created: '昨天 21:16', visual: 'cinema' },
    { id: 'r3', name: '杜比视界柔和', inputSource: 'VOD', signal: 'Dolby Vision', mode: '柔和', source: '导入方案', created: '2026.08.21', visual: 'dv' },
  ],
};

const inputSources = ['HDMI 1', 'HDMI 2', 'VOD'];
const signalTypes = ['SDR', 'HDR', 'HLG', 'Dolby Vision'];
const modeMap = {
  SDR: ['TSR鲜艳', '标准', 'FILMMAKER MODE', '电影', '游戏', '射击游戏', '角色扮演', '办公', '专家', '自然', '鲜艳', '原彩'],
  HDR: ['TSR鲜艳', '标准', 'FILMMAKER MODE', 'IMAX', '游戏', '射击游戏', '角色扮演', '办公', '专家'],
  HLG: ['TSR鲜艳', '标准', 'FILMMAKER MODE', 'IMAX', '游戏', '射击游戏', '角色扮演', '办公', '专家'],
  'Dolby Vision': ['TSR鲜艳', '杜比视界明亮', 'FILMMAKER MODE', '杜比视界游戏', '射击游戏', '角色扮演', '杜比视界IQ'],
};

const pageConfig = {
  share: { eyebrow: '分享参数', title: '分享画质参数', subtitle: '请选择信源、信号类型及图效' },
  import: { eyebrow: '导入方案', title: '导入画质方案', subtitle: '输入分享码，查看并应用他人分享的画质方案' },
  library: { eyebrow: '我的方案', title: '我的方案', subtitle: '查看、应用或管理已保存的画质方案' },
};

const DEMO_SHARE_CODE = '58372416';
const PICTURE_SHARE_PRIVACY_VERSION = '2026-08-27-v3';
const DEMO_SHARED_RECIPE = {
  id: 'demo-shared-host-game',
  name: '主机游戏 HDR',
  inputSource: 'HDMI 1',
  signal: 'HDR',
  mode: '游戏',
  source: '导入方案',
  created: '2026.08.24',
  shareCode: DEMO_SHARE_CODE,
  visual: 'hdr',
  current: false,
};


// 当前用户的画质方案值：Demo 中以本地 Mock 数据模拟，菜单名称对应用户提供的画质菜单树。
const previewGroups = [
  {
    title: '亮度', items: [
      ['亮度', '25'], ['对比度', '48'], ['伽马', '2.4'], ['自动HDR转换', '关'], ['HDR动态色调映射', '开'], ['黑电平', '47'],
      ['黑电平延伸', '低'], ['动态对比度', '关'], ['区域背光', '高'], ['峰值亮度', '中'], ['自然光', '关闭'], ['智能局域控光', '开'],
    ]
  },
  {
    title: '色彩', items: [
      ['饱和度', '52'], ['色调', '52'], ['色温', '防蓝光护眼'], ['环境色温感应', '关'], ['色彩增强', '低'], ['白平衡', '默认'],
      ['2点', '轻微暖调'], ['红色增益', '0'], ['绿色增益', '0'], ['蓝色增益', '0'], ['红色偏差', '0'], ['绿色偏差', '0'],
      ['蓝色偏差', '0'], ['重置2点白平衡', '未操作'], ['20点', '未调整'], ['分段', '1段'], ['红色', '0'], ['绿色', '0'],
      ['蓝色', '0'], ['重置20点白平衡', '未操作'], ['色彩空间', '自动'], ['颜色', '红色'], ['红', '50'], ['绿', '50'], ['蓝', '50'], ['重置色彩空间', '未操作'],
    ]
  },
  {
    title: '运动', items: [
      ['运动补偿', '24P原彩电影'], ['运动平滑', '0'], ['运动清晰', '0'], ['120/240Hz动态加速', '关'], ['LED运动清晰', '关'], ['24p原帧电影', '开'],
    ]
  },
  {
    title: '清晰度', items: [
      ['锐利度', '50'], ['水印平滑', '关'], ['MPEG降噪', '关'], ['降噪', '自动'], ['超清分辨率', '开'], ['精准细节', '开'],
    ]
  },
  {
    title: '高级设置', items: [
      ['信号范围', '自动'], ['显示标准', 'HDR视频'], ['片源色域', 'BT.2020'], ['片源白点', 'D65'], ['片源OETF', 'ST.2084'],
    ]
  },
  {
    title: '内容自动识别', items: [
      ['内容自动识别', '开'],
    ]
  },
  {
    title: '健康护眼', items: [
      ['背光调节', '混合调光'], ['环境亮度感应', '开'], ['环境色温感应', '关'], ['色彩观感还原', '开'], ['低蓝光模式', '开'],
    ]
  },
];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderNetworkControl() {
  const online = state.networkAvailable;
  networkStatus.textContent = online ? '网络正常' : '无网络';
  networkControl.textContent = online ? '断开网络' : '恢复网络';
  networkControl.classList.toggle('offline', !online);
  networkControl.setAttribute('aria-pressed', String(!online));
  networkStatusDot.classList.toggle('offline', !online);
}

function toggleNetworkSimulation() {
  state.networkAvailable = !state.networkAvailable;
  localStorage.setItem('tcl-picture-network', state.networkAvailable ? 'online' : 'offline');
  renderNetworkControl();
  showToast(state.networkAvailable ? '网络已恢复。' : '已断开网络，进入无网模拟状态。');
}

function saveRecipes() {
  localStorage.setItem('tcl-picture-recipes', JSON.stringify(state.recipes));
  localStorage.setItem('tcl-picture-applied-contexts', JSON.stringify(state.appliedContexts));
  localStorage.setItem('tcl-picture-cloud-recipes', JSON.stringify(state.cloudRecipes));
}


const MAX_LIBRARY_RECIPES = 30;

function getInputSource(recipe) {
  return inputSources.includes(recipe?.inputSource) ? recipe.inputSource : 'HDMI 1';
}

function normalizeRecipeInputSources() {
  let changed = false;
  state.recipes.forEach((recipe) => {
    if (getInputSource(recipe) === recipe.inputSource) return;
    recipe.inputSource = 'HDMI 1';
    changed = true;
  });
  if (changed) saveRecipes();
}

function saveRecipeToLibrary(recipe, source = '我创建的') {
  const shareCode = normalizeShareCode(recipe.shareCode);
  const hasShareCode = /^\d{8}$/.test(shareCode);
  const existingById = recipe.id && state.recipes.find((item) => item.id === recipe.id);
  const existingByCode = hasShareCode && state.recipes.find((item) => item.id !== recipe.id && normalizeShareCode(item.shareCode) === shareCode);

  // 同一分享码只允许保留一条本地方案记录。
  if (existingById || existingByCode) {
    const existing = existingById || existingByCode;
    if (hasShareCode) existing.shareCode = shareCode;
    saveRecipes();
    return { saved: false, duplicate: true, recipe: existing };
  }
  if (state.recipes.length >= MAX_LIBRARY_RECIPES) {
    return { saved: false, limit: true, recipe: null };
  }

  const savedRecipe = {
    id: `r-${Date.now()}`,
    ...recipe,
    shareCode: hasShareCode ? shareCode : '',
    source,
    inputSource: getInputSource(recipe),
    visual: recipe.signal === 'HDR' ? 'hdr' : recipe.signal === 'SDR' ? 'cinema' : 'dv',
    current: false,
  };
  state.recipes.unshift(savedRecipe);
  saveRecipes();
  return { saved: true, duplicate: false, recipe: savedRecipe };
}

function normalizeShareCode(value = '') {
  return String(value).replace(/\s/g, '');
}

function formatShareCode(value = '') {
  const code = normalizeShareCode(value).replace(/\D/g, '').slice(0, 8);
  return code.length > 4 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

function isObviousShareCode(code) {
  return /^(\d)\1{7}$/.test(code)
    || code === '12345678'
    || code === '87654321'
    || /^(\d{2})\1{3}$/.test(code);
}

function generateUniqueShareCode(recipe) {
  const current = normalizeShareCode(recipe.shareCode);
  const used = new Set(state.recipes
    .map((item) => normalizeShareCode(item.shareCode))
    .filter((code) => /^\d{8}$/.test(code) && code !== current));
  let code = '';
  do {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] % 100000000;
    code = String(random).padStart(8, '0');
  } while (used.has(code) || isObviousShareCode(code));
  return code;
}

function hasSavedShareCode(value) {
  const code = normalizeShareCode(value);
  return /^\d{8}$/.test(code)
    && state.recipes.some((item) => normalizeShareCode(item.shareCode) === code);
}

function findSharedRecipe(value) {
  const code = normalizeShareCode(value);
  if (!/^\d{8}$/.test(code)) return null;
  const cloudRecipe = state.cloudRecipes[code];
  if (!cloudRecipe || cloudRecipe.valid === false || cloudRecipe.revoked) return null;
  return { ...cloudRecipe, shareCode: code, saved: hasSavedShareCode(code) };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function validateSharedRecipe(value) {
  const code = normalizeShareCode(value);
  if (!/^\d{8}$/.test(code)) return { ok: false, message: '分享码无效，请检查后重新输入。' };
  if (!state.networkAvailable || navigator.onLine === false) return { ok: false, message: '网络不可用，请检查网络连接。' };

  await wait(650);
  if (!state.networkAvailable || navigator.onLine === false) return { ok: false, message: '网络不可用，请检查网络连接。' };
  const cloudRecipe = state.cloudRecipes[code];
  if (!cloudRecipe || cloudRecipe.valid === false || cloudRecipe.revoked) {
    return { ok: false, message: '分享码无效，请检查后重新输入。' };
  }
  if (!cloudRecipe.parameters || !cloudRecipe.signal || !cloudRecipe.mode || cloudRecipe.compatible === false) {
    return { ok: false, message: '方案暂不可用，请稍后重试。' };
  }
  return {
    ok: true,
    recipe: {
      ...cloudRecipe,
      source: '分享导入',
      shareCode: code,
      saved: hasSavedShareCode(code),
    },
  };
}

function cloudSnapshot(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    inputSource: getInputSource(recipe),
    signal: recipe.signal,
    mode: recipe.mode,
    shareCode: normalizeShareCode(recipe.shareCode),
    created: recipe.created,
    source: '云端方案',
    parameters: previewGroups,
    model: 'TCL C11K MiniLED',
    version: '灵悉 UI V5.2',
    compatible: true,
    valid: true,
    revoked: false,
  };
}

// 仅本机创建的方案可以生成和维护分享码；导入、历史或来源异常的方案都按不可分享处理。
function isOwnedRecipe(recipe) {
  return recipe?.source === '我创建的' || recipe?.source === '自己创建';
}

function ensureCloudShareSnapshots() {
  let changed = false;
  const demo = cloudSnapshot(DEMO_SHARED_RECIPE);
  if (!state.cloudRecipes[DEMO_SHARE_CODE] || !state.cloudRecipes[DEMO_SHARE_CODE].parameters) {
    state.cloudRecipes[DEMO_SHARE_CODE] = demo;
    changed = true;
  }
  state.recipes.forEach((recipe) => {
    const code = normalizeShareCode(recipe.shareCode);
    const owner = isOwnedRecipe(recipe);
    if (!owner || !/^\d{8}$/.test(code) || (state.cloudRecipes[code] && state.cloudRecipes[code].parameters)) return;
    state.cloudRecipes[code] = cloudSnapshot(recipe);
    changed = true;
  });
  if (changed) saveRecipes();
}

function removeCloudShare(recipe) {
  const code = normalizeShareCode(recipe.shareCode);
  const owner = isOwnedRecipe(recipe);
  if (owner && /^\d{8}$/.test(code) && state.cloudRecipes[code]) {
    delete state.cloudRecipes[code];
    saveRecipes();
  }
}


function contextKey(inputSource, signal, mode) {
  return `${inputSource}::${signal}::${mode}`;
}

function recipeReference(recipe, previous = null) {
  return {
    id: recipe.id || '',
    shareCode: normalizeShareCode(recipe.shareCode),
    name: recipe.name,
    inputSource: getInputSource(recipe),
    signal: recipe.signal,
    mode: recipe.mode,
    previous,
  };
}

function sameRecipeReference(recipe, reference) {
  if (!recipe || !reference) return false;
  const recipeCode = normalizeShareCode(recipe.shareCode);
  if (recipeCode && reference.shareCode) return recipeCode === reference.shareCode;
  return Boolean(recipe.id) && recipe.id === reference.id;
}

function appliedRecordForContext(key) {
  return state.appliedContexts[key] || null;
}

function findAppliedContextForRecipe(recipe) {
  if (!recipe) return null;
  const recipeKey = contextKey(getInputSource(recipe), recipe.signal, recipe.mode);
  const recipeRecord = appliedRecordForContext(recipeKey);
  if (sameRecipeReference(recipe, recipeRecord)) return { key: recipeKey, record: recipeRecord };
  for (const [key, record] of Object.entries(state.appliedContexts)) {
    if (sameRecipeReference(recipe, record)) return { key, record };
  }
  return null;
}

function isRecipeApplied(recipe) {
  const recipeRecord = appliedRecordForContext(contextKey(getInputSource(recipe), recipe.signal, recipe.mode));
  return sameRecipeReference(recipe, recipeRecord);
}

function findRecipeByReference(reference) {
  if (!reference) return null;
  return state.recipes.find((item) => sameRecipeReference(item, reference)) || null;
}

function setRecipeCurrent(recipe, current) {
  if (recipe) recipe.current = current;
}

function migrateAppliedContextKeys() {
  const migrated = {};
  let changed = false;
  Object.entries(state.appliedContexts).forEach(([key, record]) => {
    const parts = key.split('::');
    if (parts.length !== 2) {
      migrated[key] = record;
      return;
    }
    const [signal, mode] = parts;
    const nextKey = contextKey(getInputSource(record), signal, mode);
    const migratedRecord = { ...record, inputSource: getInputSource(record) };
    if (migratedRecord.previous) {
      migratedRecord.previous = { ...migratedRecord.previous, inputSource: getInputSource(migratedRecord.previous) };
    }
    migrated[nextKey] = migratedRecord;
    changed = true;
  });
  if (changed) {
    state.appliedContexts = migrated;
    saveRecipes();
  }
}

function migrateCurrentRecipe() {
  if (Object.keys(state.appliedContexts).length) return;
  const current = state.recipes.find((recipe) => recipe.current);
  if (!current) return;
  state.appliedContexts[contextKey(getInputSource(current), current.signal, current.mode)] = recipeReference(current);
  saveRecipes();
}

function normalizeImportedRecipeSources() {
  let changed = false;
  state.recipes.forEach((recipe) => {
    if (recipe.source !== '导入方案') return;
    recipe.source = '分享导入';
    changed = true;
  });
  if (changed) saveRecipes();
}

function removeLegacyAutoBackups() {
  const retained = state.recipes.filter((recipe) => recipe.source !== '自动备份');
  if (retained.length === state.recipes.length) return;
  state.recipes = retained;
  saveRecipes();
}

function ensureImportedShareCodes() {
  let changed = false;
  state.recipes.forEach((recipe) => {
    if (!['导入方案', '分享导入'].includes(recipe.source) || /^\d{8}$/.test(normalizeShareCode(recipe.shareCode))) return;
    recipe.shareCode = generateUniqueShareCode(recipe);
    changed = true;
  });
  if (changed) saveRecipes();
}

function focusKeyFor(element) {
  if (!element) return '';
  return element.dataset.focusKey || element.id || element.dataset.page || element.dataset.recipe || element.dataset.libraryTab || '';
}

function visibleFocusables(scope = document) {
  return [...scope.querySelectorAll('button:not([disabled]), input:not([disabled]), .focus-region[tabindex="0"]')]
    .filter((element) => element.offsetParent !== null && !element.closest('[hidden]'));
}

function rememberFocus(element = document.activeElement) {
  const key = focusKeyFor(element);
  if (key) state.focusKey = key;
  return key;
}

function restoreFocus(scope = document, fallbackKey = state.focusKey) {
  const focusables = visibleFocusables(scope);
  if (!focusables.length) return;
  const target = focusables.find((element) => focusKeyFor(element) === fallbackKey) || focusables[0];
  target.focus({ preventScroll: true });
  target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  rememberFocus(target);
}

function focusInDirection(direction) {
  const scope = modalRoot.innerHTML ? modalRoot : state.page === 'home' ? securityHomeRoot : managementRoot;
  const focusables = visibleFocusables(scope);
  if (!focusables.length) return;
  const current = focusables.includes(document.activeElement) ? document.activeElement : null;
  if (!current) {
    restoreFocus(scope);
    return;
  }
  const currentRect = current.getBoundingClientRect();
  const currentX = currentRect.left + currentRect.width / 2;
  const currentY = currentRect.top + currentRect.height / 2;
  const horizontal = direction === 'left' || direction === 'right';
  const sign = direction === 'right' || direction === 'down' ? 1 : -1;
  const candidates = focusables
    .filter((element) => element !== current)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const primary = horizontal ? (x - currentX) * sign : (y - currentY) * sign;
      const cross = horizontal ? Math.abs(y - currentY) : Math.abs(x - currentX);
      const overlap = horizontal
        ? rect.bottom >= currentRect.top && rect.top <= currentRect.bottom
        : rect.right >= currentRect.left && rect.left <= currentRect.right;
      return { element, primary, cross, overlap, distance: Math.hypot(x - currentX, y - currentY) };
    })
    .filter((candidate) => candidate.primary > 2)
    .sort((a, b) => {
      if (a.overlap !== b.overlap) return a.overlap ? -1 : 1;
      const scoreA = a.primary + a.cross * 1.8 + a.distance * .08;
      const scoreB = b.primary + b.cross * 1.8 + b.distance * .08;
      return scoreA - scoreB;
    });
  const next = candidates[0]?.element;
  if (next) {
    next.focus({ preventScroll: true });
    next.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    rememberFocus(next);
  }
}

function focusDetailElement(key) {
  const element = app.querySelector(`[data-focus-key="${key}"]`);
  if (!element) return false;
  element.focus({ preventScroll: true });
  element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  rememberFocus(element);
  return true;
}

function scrollDetailParameters(direction) {
  const region = app.querySelector('#detail-parameters');
  const scroller = region?.querySelector('.parameter-groups');
  if (!region || !scroller) return;
  const amount = Math.max(180, Math.round(scroller.clientHeight * 0.72));
  scroller.scrollBy({ top: direction === 'down' ? amount : -amount, behavior: 'smooth' });
}

function handleDetailArrowKey(key) {
  if (state.page !== 'library' || !state.selectedRecipe) return false;
  const target = document.activeElement;
  const inSummary = target?.closest('.detail-summary');
  const inParameters = target?.closest('#detail-parameters');

  if (key === 'ArrowRight' && inSummary) {
    return focusDetailElement('detail-parameters');
  }
  if (inParameters && key === 'ArrowLeft') {
    return focusDetailElement('detail-apply');
  }
  if (inParameters && (key === 'ArrowUp' || key === 'ArrowDown')) {
    scrollDetailParameters(key === 'ArrowDown' ? 'down' : 'up');
    return true;
  }
  return false;
}

function handleBack() {
  if (modalRoot.innerHTML) {
    closeModal();
    return;
  }
  if (state.page === 'home') return;
  if (state.page === 'library' && state.selectedRecipe) {
    const recipeKey = `recipe-${state.selectedRecipe.id}`;
    state.selectedRecipe = null;
    state.focusKey = recipeKey;
    renderLibrary();
    return;
  }
  setSecurityHome();
}


// 电视端以 1920 × 1080 作为大屏设计基准：超过该尺寸时等比放大整套界面，避免 4K / 超宽屏出现内容过小和右侧大面积留白。
function updateDisplayScale() {
  const designWidth = 1920;
  const designHeight = 1080;
  const useCanvasScale = window.innerWidth > 2100 && window.innerHeight > 1000;
  document.body.classList.toggle('tv-canvas-active', useCanvasScale);
  if (!useCanvasScale) {
    tvStage.style.removeProperty('--tv-scale');
    return;
  }
  const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);
  tvStage.style.setProperty('--tv-scale', String(scale));
}

function setPage(page) {
  const fromHome = state.page === 'home';
  state.page = page;
  state.selectedRecipe = null;
  if (fromHome) {
    state.focusKey = page === 'share'
      ? 'input-source-hdmi-1'
      : page === 'import'
        ? 'import-code'
        : 'library-tab-全部';
  }
  securityHomeRoot.hidden = true;
  managementRoot.hidden = false;
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
  const config = pageConfig[page];
  eyebrow.textContent = config.eyebrow;
  pageTitle.textContent = config.title;
  pageSubtitle.textContent = config.subtitle;
  render();
  restoreFocus(managementRoot);
}

function setSecurityHome() {
  closeModal();
  state.page = 'home';
  state.focusKey = 'home-entry-备份与恢复';
  securityHomeRoot.hidden = false;
  managementRoot.hidden = true;
  renderSecurityHome();
}

function renderSecurityHome() {
  const entries = [
    { icon: '✦', label: '深度清理', kind: 'utility' },
    { icon: '▦', label: '应用管理', kind: 'utility' },
    { icon: '♙', label: '权限管理', kind: 'utility' },
    { icon: '⌁', label: '电视诊断', kind: 'utility' },
    { icon: '▣', label: '备份与恢复', kind: 'quality', featured: true },
    { icon: '⌘', label: '画质方案管理', kind: 'quality' },
    { icon: '⚙', label: '更多设置', kind: 'utility' },
  ];
  securityHomeRoot.innerHTML = `
    <div class="security-home-inner">
      <header class="security-header"><h1>安全卫士</h1></header>
      <section class="security-overview" aria-label="设备状态">
        <div class="security-stat memory"><div class="stat-ring"><strong>58<small>%</small></strong><span>占用内存</span></div></div>
        <div class="security-stat junk"><div class="stat-ring"><strong>144<small>MB</small></strong><span>系统垃圾</span></div></div>
        <div class="security-stat apps"><div class="stat-ring"><strong>39<small>个</small></strong><span>运行程序</span></div></div>
      </section>
      <button class="optimize-btn focusable" type="button" id="optimize-btn" data-focus-key="home-optimize">一键优化</button>
      <nav class="security-entry-grid" aria-label="安全卫士功能入口">
        ${entries.map((entry) => `<button class="security-entry focusable ${entry.featured ? 'featured' : ''}" type="button" data-home-entry="${entry.kind}" data-focus-key="home-entry-${escapeHtml(entry.label)}"><span class="entry-icon">${entry.icon}</span><span>${entry.label}</span></button>`).join('')}
      </nav>
    </div>`;
  securityHomeRoot.querySelectorAll('[data-home-entry="quality"]').forEach((button) => button.addEventListener('click', () => enterPictureSharing()));
  securityHomeRoot.querySelectorAll('[data-home-entry="utility"]').forEach((button) => button.addEventListener('click', () => showToast('该功能为安全卫士的其他入口，本 Demo 暂未配置。')));
  securityHomeRoot.querySelector('#optimize-btn').addEventListener('click', () => showToast('优化完成：已清理 144 MB 系统垃圾'));
  restoreFocus(securityHomeRoot);
}


function hasAcceptedPictureSharePrivacy() {
  return localStorage.getItem('tcl-picture-share-privacy-version') === PICTURE_SHARE_PRIVACY_VERSION;
}

function acceptPictureSharePrivacy() {
  localStorage.setItem('tcl-picture-share-privacy-version', PICTURE_SHARE_PRIVACY_VERSION);
}

function enterPictureSharing() {
  if (hasAcceptedPictureSharePrivacy()) {
    setPage('share');
    return;
  }
  openPictureSharePrivacyNotice();
}

function openPictureSharePrivacyNotice() {
  openModal(`
    <div class="modal-head privacy-modal-head">
      <div><h2 class="modal-title">画质参数分享使用通知</h2></div>
      <button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button>
    </div>
    <div class="modal-body privacy-modal-body">
      <div class="privacy-copy">
        <p>使用画质参数分享功能时，系统会收集当前方案的信号类型、图效及对应画质参数，并结合设备型号和软件版本生成分享方案。</p>
        <p>生成或导入分享方案时，相关方案信息会上传至云端，用于生成分享码、查询方案及完成参数预览。上述信息仅用于画质参数分享功能，不会用于与本功能无关的用途。</p>
        <p>我们会按照隐私保护要求对相关数据进行安全存储和传输。未保存到「我的方案」的本地内容不会因进入本功能而被修改。</p>
      </div>
      <div class="privacy-consent-row">
        <label class="privacy-checkbox-label" for="picture-share-privacy-check">
          <input class="privacy-checkbox focusable" id="picture-share-privacy-check" data-focus-key="privacy-check" data-autofocus type="checkbox" ${state.privacyChecked ? 'checked' : ''} />
          <span class="privacy-checkbox-mark" aria-hidden="true"></span>
          <span class="privacy-consent-text">我已阅读并同意</span>
        </label>
        <button class="privacy-link focusable" type="button" id="picture-share-privacy-detail" data-focus-key="privacy-detail">《画质参数分享隐私协议》</button>
      </div>
    </div>
    <div class="modal-foot privacy-modal-foot">
      <button class="secondary-btn focusable" type="button" id="picture-share-privacy-cancel" data-focus-key="privacy-cancel">取消</button>
      <button class="primary-btn focusable" type="button" id="picture-share-privacy-agree" data-focus-key="privacy-agree" ${state.privacyChecked ? '' : 'disabled'}>同意</button>
    </div>`, false, 'privacy-modal');

  modalRoot.querySelector('.modal-close').addEventListener('click', () => { state.privacyChecked = false; });
  const check = modalRoot.querySelector('#picture-share-privacy-check');
  const agree = modalRoot.querySelector('#picture-share-privacy-agree');
  const syncConsent = () => {
    state.privacyChecked = check.checked;
    agree.disabled = !state.privacyChecked;
  };
  check.addEventListener('change', syncConsent);
  modalRoot.querySelector('#picture-share-privacy-detail').addEventListener('click', openPictureSharePrivacyDetail);
  modalRoot.querySelector('#picture-share-privacy-cancel').addEventListener('click', () => {
    state.privacyChecked = false;
    closeModal();
  });
  agree.addEventListener('click', () => {
    if (!state.privacyChecked) return;
    acceptPictureSharePrivacy();
    state.privacyChecked = false;
    closeModal({ restore: false });
    setPage('share');
  });
}

function openPictureSharePrivacyDetail() {
  openModal(`
    <div class="modal-head privacy-modal-head">
      <div><h2 class="modal-title">画质参数分享隐私协议</h2></div>
      <button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button>
    </div>
    <div class="modal-body privacy-detail-body">
      <section class="privacy-detail-section">
        <h3>一、信息收集</h3>
        <p>为完成画质参数分享、导入和预览，系统会收集方案名称、信号类型、图效、方案中包含的画质参数，以及设备型号和软件版本信息。</p>
      </section>
      <section class="privacy-detail-section">
        <h3>二、信息使用与上传</h3>
        <p>上述信息用于生成和校验分享码、查询分享方案、展示参数预览，以及将方案保存到本机「我的方案」。生成分享码或导入新方案时，方案数据可能上传至云端进行处理。</p>
      </section>
      <section class="privacy-detail-section">
        <h3>三、信息保护</h3>
        <p>系统会采取必要的安全措施保护方案数据。分享码与方案内容绑定，分享码失效或被撤回后，不能继续查询和导入；已经保存到本机的方案不受影响。</p>
      </section>
      <section class="privacy-detail-section">
        <h3>四、你的权利</h3>
        <p>你可以在「我的方案」中查看和删除已保存的方案。删除分享方案后，对应分享码将不可继续使用。你也可以随时停止使用画质参数分享功能。</p>
      </section>
    </div>
    <div class="modal-foot privacy-modal-foot">
      <button class="secondary-btn focusable" type="button" id="privacy-detail-back" data-focus-key="privacy-detail-back" data-autofocus>返回</button>
    </div>`, false, 'privacy-modal');
  modalRoot.querySelector('.modal-close').addEventListener('click', () => { state.privacyChecked = false; });
  modalRoot.querySelector('#privacy-detail-back').addEventListener('click', openPictureSharePrivacyNotice);
}

function currentContext() {
  const signal = state.signal === 'HDR' ? 'HDR10' : state.signal;
  return `${state.inputSource} · ${signal} · ${state.mode}模式`;
}

function recipeContext(recipe) {
  const signal = recipe.signal === 'HDR' ? 'HDR10' : recipe.signal;
  return `${getInputSource(recipe)} · ${signal} · ${recipe.mode}模式`;
}

function render() {
  if (state.page === 'share') renderShare();
  if (state.page === 'import') renderImport();
  if (state.page === 'library') renderLibrary();
}

function renderShare() {
  const modes = modeMap[state.signal];
  if (!modes.includes(state.mode)) state.mode = modes[0];

  app.innerHTML = `
    <div class="share-layout">
      <div class="form-stage">
        <div class="section-lead"><h2>选择画质环境</h2><p>请先选择信源，再选择信号类型和图效，方案将保存当前环境下的画质菜单参数。</p></div>
        <div class="choice-block">
          <div class="choice-label">信源</div>
          <div class="choice-carousel source-carousel" aria-label="信源横向选择">
            <div class="carousel-track">
              ${inputSources.map((source) => `<button class="choice focusable ${source === state.inputSource ? 'selected' : ''}" type="button" data-input-source="${source}" data-focus-key="input-source-${source.replaceAll(' ', '-').toLowerCase()}"><span class="choice-value">${source}</span></button>`).join('')}
            </div>
          </div>
        </div>
        <div class="choice-block">
          <div class="choice-label">信号类型</div>
          <div class="choice-carousel signal-carousel" aria-label="信号类型横向选择">
            <div class="carousel-track">
              ${signalTypes.map((signal) => `<button class="choice focusable ${signal === state.signal ? 'selected' : ''}" type="button" data-signal="${signal}" data-focus-key="signal-${signal}"><span class="choice-value">${signal}</span></button>`).join('')}
            </div>
          </div>
        </div>
        <div class="choice-block">
          <div class="choice-label">图效</div>
          <div class="choice-carousel mode-carousel" aria-label="图效横向选择">
            <div class="carousel-track">
              ${modes.map((mode) => `<button class="choice focusable ${mode === state.mode ? 'selected' : ''}" type="button" data-mode="${mode}" data-focus-key="mode-${mode}"><span class="choice-value">${mode}</span></button>`).join('')}
            </div>
          </div>
        </div>
        <div class="share-actions"><button class="primary-btn focusable" id="share-start" data-focus-key="share-start" type="button">去分享</button></div>
      </div>
      <aside class="context-card" aria-label="当前待分享画质环境">
        <div class="context-overline">当前画质</div>
        <h3>${escapeHtml(state.inputSource)} · ${escapeHtml(state.signal)} · ${escapeHtml(state.mode)}</h3>
        <p>当前画质参数将生成分享方案，同一信源、信号类型和图效下可使用。接收方导入后可查看参数并确认应用。</p>
        <div class="context-meta">
          <div><span>当前设备</span><b>TCL C11K MiniLED</b></div>
          <div><span>参数来源</span><b>${escapeHtml(currentContext())}</b></div>
        </div>
      </aside>
    </div>`;

  app.querySelectorAll('[data-input-source]').forEach((button) => button.addEventListener('click', () => { state.inputSource = button.dataset.inputSource; renderShare(); }));
  app.querySelectorAll('[data-signal]').forEach((button) => button.addEventListener('click', () => { state.signal = button.dataset.signal; renderShare(); }));
  app.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => { state.mode = button.dataset.mode; renderShare(); }));
  app.querySelector('#share-start').addEventListener('click', openNameModal);
  restoreFocus(app);
  requestAnimationFrame(() => {
    app.querySelector('.mode-carousel .choice.selected')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}

function renderImport() {
  app.innerHTML = `
    <div class="import-layout">
      <section class="import-card">
        <h2>导入画质方案</h2>
        <p>输入他人分享的方案码。导入后可预览完整参数，并确认是否应用到当前图效。</p>
        <div class="model-share-tip"><span>机型提示</span>支持 116Q10、100Q10、85Q10、75Q10、6Q10 用户的调色分享码，输入后即可一键应用。</div>
        <input id="share-code" data-focus-key="import-code" class="code-input focusable" maxlength="9" inputmode="numeric" value="${escapeHtml(formatShareCode(state.importedCode))}" placeholder="0000 0000" aria-label="画质方案分享码" />
        <div class="import-actions"><button class="primary-btn focusable" id="import-submit" data-focus-key="import-submit" type="button">导入方案</button></div>
        <div class="code-examples"><span>演示分享码：</span><button type="button" class="code-example focusable" data-focus-key="import-example" data-code="${DEMO_SHARE_CODE}">${formatShareCode(DEMO_SHARE_CODE)}</button></div>
      </section>
    </div>`;
  const input = app.querySelector('#share-code');
  const normalizeInput = () => {
    state.importedCode = input.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 8);
    input.value = formatShareCode(state.importedCode);
  };
  input.addEventListener('input', normalizeInput);
  app.querySelector('.code-example').addEventListener('click', () => {
    state.importedCode = DEMO_SHARE_CODE;
    input.value = formatShareCode(DEMO_SHARE_CODE);
    input.focus();
  });
  app.querySelector('#import-submit').addEventListener('click', async () => {
    normalizeInput();
    if (state.busy) return;
    if (state.importedCode.length !== 8) {
      showToast('请输入8位数字分享码');
      return;
    }

    state.busy = true;
    openLoadingModal('校验中', '正在查询分享码及方案信息，请稍候');
    try {
      const result = await validateSharedRecipe(state.importedCode);
      closeLoadingModal();
      if (result.ok) {
        openParameterPreview('import', result.recipe);
      } else {
        restoreFocus(app, 'import-submit');
        showToast(result.message);
      }
    } catch (error) {
      closeLoadingModal();
      restoreFocus(app, 'import-submit');
      showToast('加载失败，请稍后重试。');
    }
  });
  restoreFocus(app);
}

function renderLibrary() {
  if (state.selectedRecipe) return renderRecipeDetail();
  const available = state.libraryTab === '全部'
    ? state.recipes
    : state.recipes.filter((recipe) => state.libraryTab === 'HDR'
      ? ['HDR', 'HLG'].includes(recipe.signal)
      : recipe.signal === state.libraryTab);
  app.innerHTML = `
    <div class="library-page">
      <div class="library-head">
        <div class="library-tabs">
          ${['全部', 'SDR', 'HDR', 'Dolby Vision'].map((tab) => `<button class="mini-tab focusable ${tab === state.libraryTab ? 'active' : ''}" type="button" data-library-tab="${tab}" data-focus-key="library-tab-${tab}">${tab}</button>`).join('')}
        </div>
      </div>
      <div class="recipe-grid">
        ${available.map((recipe) => recipeCard(recipe)).join('')}
      </div>
    </div>`;
  app.querySelectorAll('[data-library-tab]').forEach((button) => button.addEventListener('click', () => { state.libraryTab = button.dataset.libraryTab; renderLibrary(); }));
  app.querySelectorAll('[data-recipe]').forEach((button) => button.addEventListener('click', () => { state.selectedRecipe = state.recipes.find((recipe) => recipe.id === button.dataset.recipe); state.focusKey = 'detail-apply'; renderLibrary(); }));
  restoreFocus(app);
}

function recipeCard(recipe) {
  return `<button class="recipe-card focusable" type="button" data-recipe="${recipe.id}" data-focus-key="recipe-${recipe.id}" aria-label="查看方案 ${escapeHtml(recipe.name)}">
    <span class="recipe-visual ${recipe.visual || 'cinema'}"></span>
    <span class="recipe-tag">${escapeHtml(recipe.signal)}</span>
    <span class="recipe-meta ${isRecipeApplied(recipe) ? 'current' : ''}">${isRecipeApplied(recipe) ? '当前使用' : escapeHtml(recipe.source)}</span>
    <h3>${escapeHtml(recipe.name)}</h3>
    <p>${escapeHtml(getInputSource(recipe))} · ${escapeHtml(recipe.mode)} · ${escapeHtml(recipe.created)}</p>
  </button>`;
}

function renderRecipeDetail() {
  const recipe = state.selectedRecipe;
  const imported = !isOwnedRecipe(recipe);
  const recipeType = imported ? '分享导入' : '自己创建';
  const shareCode = normalizeShareCode(recipe.shareCode);
  app.innerHTML = `
    <div class="library-detail detail-focus-left">
      <aside class="detail-summary" aria-label="方案信息与操作">
        <h2>${escapeHtml(recipe.name)}</h2>
        <p>${imported ? '本方案由分享码导入，可查看参数并应用到匹配的图效环境。' : '本方案包含当前图像设置菜单中的画质参数定义，可再次分享或应用到匹配的图效环境。'}</p>
        <div class="detail-facts">
          <div><span>信源</span><b>${escapeHtml(getInputSource(recipe))}</b></div>
          <div><span>信号类型</span><b>${escapeHtml(recipe.signal)}</b></div>
          <div><span>图效</span><b>${escapeHtml(recipe.mode)}</b></div>
          <div><span>保存时间</span><b>${escapeHtml(recipe.created)}</b></div>
        </div>
        <div class="detail-type ${imported ? 'is-imported' : 'is-created'}">
          <span>方案类型</span>
          <b>${recipeType}</b>
          ${imported ? `<small>分享码：${escapeHtml(formatShareCode(shareCode) || '未生成')}</small>` : ''}
        </div>
        <div class="detail-buttons">
          <button class="primary-btn focusable" type="button" id="detail-apply" data-focus-key="detail-apply">应用方案</button>
          ${imported ? '' : '<button class="secondary-btn focusable" type="button" id="detail-share" data-focus-key="detail-share">分享方案</button>'}
          <button class="danger-btn focusable" type="button" id="detail-delete" data-focus-key="detail-delete">删除方案</button>
        </div>
      </aside>
      <section class="table-section detail-parameter-section focusable" id="detail-parameters" tabindex="0" data-focus-key="detail-parameters" role="region" aria-label="画质设置参数，仅供查看">
        <div class="preview-intro"><div><div class="choice-label">画质设置参数</div><p>仅显示设置项名称及当前方案值。</p></div><div class="group-count">${recipe.parameters?.length || previewGroups.length} 个分组</div></div>
        ${parameterGroups(recipe.parameters || previewGroups)}
      </section>
    </div>`;
  app.querySelector('#detail-share')?.addEventListener('click', () => generateShareCode(recipe));
  // 应用后仍保留「应用方案」，允许用户重复进入确认流程并再次应用。
  app.querySelector('#detail-apply').addEventListener('click', () => openApplyConfirm(recipe));
  app.querySelector('#detail-delete').addEventListener('click', () => openDeleteConfirm(recipe));
  restoreFocus(app, 'detail-apply');
}

function parameterGroups(groups = previewGroups) {
  return `<div class="parameter-groups">${groups.map((group) => `
    <section class="parameter-group">
      <div class="group-heading">
        <div><h3>${escapeHtml(group.title)}</h3></div>
        <span>${group.items.length} 项</span>
      </div>
      <div class="value-grid">
        ${group.items.map(([name, value]) => `<div class="value-chip"><span>${escapeHtml(name)}</span><b>${escapeHtml(value)}</b></div>`).join('')}
      </div>
    </section>`).join('')}</div>`;
}

function previewFacts(recipe, type) {
  const groupCount = recipe.parameters?.length || previewGroups.length;
  const status = type === 'share'
    ? recipe.shareCode ? '已生成' : '待生成'
    : hasSavedShareCode(recipe.shareCode) ? '已存在此方案' : '新方案';
  const signal = recipe.signal === 'HDR' ? 'HDR10' : recipe.signal;
  return `<div class="preview-facts">
    <div class="preview-fact"><span>方案名称</span><b>${escapeHtml(recipe.name)}</b></div>
    <div class="preview-fact"><span>信源</span><b>${escapeHtml(getInputSource(recipe))}</b></div>
    <div class="preview-fact"><span>信号</span><b>${escapeHtml(signal)}</b></div>
    <div class="preview-fact"><span>图效</span><b>${escapeHtml(recipe.mode)}</b></div>
    <div class="preview-fact"><span>状态</span><b id="preview-status">${escapeHtml(status)}</b></div>
  </div>`;
}

function openModal(content, wide = false, variant = '') {
  if (!modalRoot.innerHTML) {
    state.previousFocusElement = document.activeElement;
    state.previousFocusKey = state.focusKey;
  }
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal ${wide ? 'wide' : ''} ${variant}" role="dialog" aria-modal="true">${content}</section></div>`;
  modalRoot.querySelectorAll('.focusable').forEach((element, index) => {
    if (!element.dataset.focusKey) element.dataset.focusKey = element.id || `modal-control-${index}`;
  });
  const backdrop = modalRoot.querySelector('.modal-backdrop');
  if (!modalRoot.querySelector('.loading-modal')) {
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) closeModal(); });
  }
  modalRoot.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
  const first = modalRoot.querySelector('[data-autofocus]') || modalRoot.querySelector('input, button');
  if (first) setTimeout(() => { first.focus(); rememberFocus(first); }, 0);
}

function openLoadingModal(title, message) {
  openModal(`
    <div class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true"></div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
    </div>`, false, 'loading-modal');
}

function closeLoadingModal() {
  state.busy = false;
  closeModal({ restore: false });
}

function closeModal({ restore = true } = {}) {
  modalRoot.innerHTML = '';
  if (!restore) return;
  const previous = state.previousFocusElement;
  const previousKey = state.previousFocusKey;
  state.previousFocusElement = null;
  state.previousFocusKey = null;
  state.focusKey = previousKey || state.focusKey;
  if (previous?.isConnected && previous.offsetParent !== null) {
    previous.focus({ preventScroll: true });
    rememberFocus(previous);
  } else {
    restoreFocus(state.page === 'home' ? securityHomeRoot : managementRoot);
  }
}

function openNameModal() {
  openModal(`
    <div class="modal-head"><div><h2 class="modal-title">分享画质参数</h2></div><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      <label class="name-label" for="recipe-name">方案名称</label>
      <input id="recipe-name" class="name-input focusable" value="${escapeHtml(state.draftName)}" maxlength="20" />
      <div class="modal-context">
        <div class="context-pill"><span>当前设备</span><b>TCL C11K MiniLED</b></div>
        <div class="context-pill"><span>分享环境</span><b>${escapeHtml(currentContext())}</b></div>
      </div>
    </div>
    <div class="modal-foot"><button class="secondary-btn focusable" type="button" data-modal-close>取消</button><button class="primary-btn focusable" type="button" id="name-next">下一步</button></div>`);
  modalRoot.querySelector('#name-next').addEventListener('click', () => {
    state.draftName = modalRoot.querySelector('#recipe-name').value.trim() || '未命名画质方案';
    openParameterPreview('share', { id: `r-${Date.now()}`, name: state.draftName, inputSource: state.inputSource, signal: state.signal, mode: state.mode, created: '刚刚', source: '我创建的' });
  });
}

function openParameterPreview(type, recipe) {
  const isShare = type === 'share';
  const canSave = isShare || type === 'import';
  if (!isShare) recipe.saved = hasSavedShareCode(recipe.shareCode);
  openModal(`
    <div class="modal-head"><div><h2 class="modal-title">${isShare ? '分享参数预览' : '导入方案预览'}</h2></div><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      ${previewFacts(recipe, type)}
      <section class="settings-preview">
        <div class="settings-preview-head"><span class="group-count">${recipe.parameters?.length || previewGroups.length} 个分组</span></div>
        ${parameterGroups(recipe.parameters || previewGroups)}
      </section>
    </div>
    <div class="modal-foot">
      <button class="secondary-btn focusable" type="button" data-modal-close data-focus-key="preview-back">返回</button>
      ${canSave ? `<button class="secondary-btn focusable" type="button" id="save-preview" data-focus-key="save-preview" ${recipe.saved ? 'disabled' : ''}>${recipe.saved ? '已保存' : '保存方案'}</button>` : ''}
      <button class="primary-btn focusable" type="button" id="preview-action" data-focus-key="preview-action" data-autofocus>${isShare ? (recipe.shareCode ? '重新生成分享码' : '生成分享码') : '应用方案'}</button>
    </div>`, true);
  modalRoot.querySelector('#preview-action').addEventListener('click', () => isShare ? generateShareCode(recipe) : openApplyConfirm(recipe));
  if (canSave) {
    modalRoot.querySelector('#save-preview').addEventListener('click', (event) => {
      if (event.currentTarget.disabled) return;
      const result = saveRecipeToLibrary(recipe, isShare ? '我创建的' : '分享导入');
      if (result.limit) {
        showToast('方案数量已达上限，请删除部分方案后重试。');
        return;
      }
      recipe.saved = true;
      event.currentTarget.textContent = '已保存';
      event.currentTarget.disabled = true;
      showToast('方案已保存。');
    });
  }
}

function generateShareCode(recipe) {
  // 通过分享码导入并保存的本地方案只能查看、应用或删除，不能再次生成分享码。
  if (!isOwnedRecipe(recipe)) {
    showToast('导入方案不支持再次分享。');
    return;
  }
  if (!state.networkAvailable || navigator.onLine === false) {
    showToast('网络不可用，请检查网络连接。');
    return;
  }
  recipe.shareCode = generateUniqueShareCode(recipe);
  recipe.saved = true;
  const result = saveRecipeToLibrary(recipe);
  if (result.limit) {
    // 方案未入库时不生成云端分享码，避免产生无法吊销的孤儿分享码。
    recipe.shareCode = '';
    recipe.saved = false;
    showToast('方案数量已达上限，请删除部分方案后重试。');
    return;
  }
  state.cloudRecipes[recipe.shareCode] = cloudSnapshot(recipe);
  saveRecipes();
  openShareCode(recipe);
  showToast('分享码已生成');
}

function openShareCode(recipe) {
  openModal(`
    <div class="modal-head"><div><h2 class="modal-title">分享码已生成</h2></div><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      <div class="model-share-tip"><span>机型提示</span>支持 116Q10、100Q10、85Q10、75Q10、6Q10 用户的调色分享码，导入后即可一键应用。</div>
      <div class="generated-code">${escapeHtml(formatShareCode(recipe.shareCode))}</div>
      <div class="code-copy-note">将分享码发送给好友，对方可在“导入分享方案”中查看并应用方案。</div>
    </div>
    <div class="modal-foot"><button class="primary-btn focusable" type="button" id="code-done" data-focus-key="code-done" data-autofocus>完成</button></div>`);
  modalRoot.querySelector('#code-done').addEventListener('click', closeModal);
}


function openDeleteConfirm(recipe) {
  openModal(`
    <div class="modal-head"><div><h2 class="modal-title">删除“${escapeHtml(recipe.name)}”？</h2></div><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      <p class="confirm-copy">删除后，该方案将从「我的方案」中移除，且<strong>原分享码立即失效，无法再通过分享码导入该方案</strong>。</p>
      <p class="confirm-copy delete-preserved-note"><strong>已通过分享码保存到本地的方案不受影响，可继续使用。</strong></p>
    </div>
    <div class="modal-foot"><button class="secondary-btn focusable" type="button" data-modal-close data-autofocus data-focus-key="delete-cancel">取消</button><button class="danger-btn focusable" type="button" id="confirm-delete" data-focus-key="confirm-delete">确认删除</button></div>`);
  modalRoot.querySelector('#confirm-delete').addEventListener('click', () => {
    removeCloudShare(recipe);
    const appliedContext = findAppliedContextForRecipe(recipe);
    if (appliedContext) {
      const { key, record } = appliedContext;
      if (record.previous) state.appliedContexts[key] = record.previous;
      else delete state.appliedContexts[key];
      const previous = findRecipeByReference(record.previous);
      setRecipeCurrent(previous, Boolean(record.previous));
    }
    state.recipes = state.recipes.filter((item) => item.id !== recipe.id);
    state.selectedRecipe = null;
    saveRecipes();
    closeModal({ restore: false });
    state.focusKey = `recipe-${recipe.id}`;
    renderLibrary();
    showToast('方案已删除');
  });
}

function isCurrentRecipeSame(recipe) {
  const recipeRecord = appliedRecordForContext(contextKey(getInputSource(recipe), recipe.signal, recipe.mode));
  return sameRecipeReference(recipe, recipeRecord);
}

function applyRecipeToDevice(recipe) {
  if (recipe.applyAvailable === false) return { ok: false };

  // 应用目标始终以方案自身的「信号 + 图效」为准，避免预览与确认弹窗信息不一致。
  const targetInputSource = getInputSource(recipe);
  const targetSignal = recipe.signal;
  const targetMode = recipe.mode;
  const key = contextKey(targetInputSource, targetSignal, targetMode);
  const previous = appliedRecordForContext(key);
  const recipeCode = normalizeShareCode(recipe.shareCode);
  let target = recipe.id && state.recipes.find((item) => item.id === recipe.id);
  if (!target && recipeCode) target = state.recipes.find((item) => normalizeShareCode(item.shareCode) === recipeCode);
  if (!target) {
    target = {
      id: `import-${Date.now()}`,
      ...recipe,
      inputSource: targetInputSource,
      source: '分享导入',
      visual: recipe.signal === 'HDR' ? 'hdr' : recipe.signal === 'SDR' ? 'cinema' : 'dv',
    };
    state.recipes.unshift(target);
  }

  const previousRecipe = findRecipeByReference(previous);
  setRecipeCurrent(previousRecipe, false);
  setRecipeCurrent(target, true);
  state.appliedContexts[key] = recipeReference(target, previous);
  saveRecipes();
  return { ok: true, target, key };
}

function finishApplySuccess(result) {
  closeLoadingModal();
  // 应用成功后，当前信号和图效同步到已应用方案，后续页面展示保持一致。
  state.inputSource = getInputSource(result.target);
  state.signal = result.target.signal;
  state.mode = result.target.mode;
  state.page = 'library';
  state.selectedRecipe = result.target;
  state.focusKey = 'detail-apply';
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.page === 'library'));
  const config = pageConfig.library;
  eyebrow.textContent = config.eyebrow;
  pageTitle.textContent = config.title;
  pageSubtitle.textContent = config.subtitle;
  render();
  showToast('方案已应用。');
}

function saveImportedAfterApplyFailure(recipe) {
  const result = saveRecipeToLibrary(recipe, '分享导入');
  if (!result.limit) recipe.saved = true;
  return result;
}

function finishApplyFailure(recipe, fromDetail) {
  const saved = saveImportedAfterApplyFailure(recipe);
  closeLoadingModal();
  if (saved.limit) {
    showToast('方案数量已达上限，请删除部分方案后重试。');
    return;
  }

  if (fromDetail) {
    state.selectedRecipe = saved.recipe || recipe;
    state.focusKey = 'detail-apply';
    renderRecipeDetail();
  } else {
    openParameterPreview('import', { ...recipe, saved: true, source: '分享导入' });
  }
  showToast('应用失败，已将方案保存至我的方案中，请稍后重试。');
}

function openApplyConfirm(recipe) {
  // 标题、说明和覆盖提示均使用方案自身的信号与图效。
  const context = recipeContext(recipe);
  openModal(`
    <div class="modal-head"><h2 class="modal-title">应用到当前 ${escapeHtml(context)}？</h2><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      <div class="confirm-icon">!</div>
      <p class="confirm-copy">“${escapeHtml(recipe.name)}”将修改当前 <strong>${escapeHtml(context)}</strong> 下的画质参数。如需恢复，可在「图像设置」菜单点击「重置当前图效」，恢复该信号图效下的默认值。</p>
      <div class="coverage-note"><b>参数覆盖</b>　应用后将覆盖当前 <strong>${escapeHtml(context)}</strong> 下的画质参数。</div>
    </div>
    <div class="modal-foot"><button class="secondary-btn focusable" type="button" data-modal-close>取消</button><button class="primary-btn focusable" type="button" id="confirm-apply">确认应用</button></div>`);
  modalRoot.querySelector('#confirm-apply').addEventListener('click', async () => {
    if (state.busy) return;
    // 即使当前已经是同一方案，也允许用户再次确认并重复应用。
    const fromDetail = Boolean(state.selectedRecipe);
    closeModal({ restore: false });
    state.busy = true;
    openLoadingModal('应用中', '正在应用画质参数，请稍候');
    try {
      await wait(650);
      const result = applyRecipeToDevice(recipe);
      if (result.ok) finishApplySuccess(result);
      else finishApplyFailure(recipe, fromDetail);
    } catch (error) {
      finishApplyFailure(recipe, fromDetail);
    }
  });
}

function openCancelApplyConfirm(recipe) {
  openModal(`
    <div class="modal-head"><h2 class="modal-title">取消应用？</h2><button class="modal-close focusable" type="button" data-modal-close aria-label="关闭">×</button></div>
    <div class="modal-body">
      <div class="confirm-icon">!</div>
      <p class="confirm-copy">取消应用后，将恢复应用该方案前的画质设置。是否继续？</p>
    </div>
    <div class="modal-foot"><button class="secondary-btn focusable" type="button" data-modal-close>取消</button><button class="danger-btn focusable" type="button" id="confirm-cancel-apply">确认取消</button></div>`);
  modalRoot.querySelector('#confirm-cancel-apply').addEventListener('click', () => {
    if (state.busy) return;
    const key = contextKey(getInputSource(recipe), recipe.signal, recipe.mode);
    const record = appliedRecordForContext(key);
    if (!sameRecipeReference(recipe, record)) {
      closeModal();
      showToast('操作失败，请稍后重试。');
      return;
    }

    const previous = record.previous;
    const previousRecipe = findRecipeByReference(previous);
    const currentRecipe = findRecipeByReference(record);
    setRecipeCurrent(currentRecipe, false);
    setRecipeCurrent(previousRecipe, Boolean(previous));
    if (previous) state.appliedContexts[key] = previous;
    else delete state.appliedContexts[key];
    saveRecipes();
    closeModal({ restore: false });
    state.selectedRecipe = currentRecipe || recipe;
    state.focusKey = 'detail-apply';
    renderRecipeDetail();
    showToast('已取消应用。');
  });
}

function showToast(message) {
  toastRoot.innerHTML = `<div class="toast">${escapeHtml(message)}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toastRoot.innerHTML = ''; }, 2800);
}

document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => setPage(button.dataset.page)));
networkControl.addEventListener('click', toggleNetworkSimulation);
renderNetworkControl();
window.addEventListener('resize', updateDisplayScale);
document.addEventListener('focusin', (event) => {
  rememberFocus(event.target);
  const detail = event.target.closest('.library-detail');
  if (!detail) return;
  const rightFocused = Boolean(event.target.closest('#detail-parameters'));
  detail.classList.toggle('detail-focus-right', rightFocused);
  detail.classList.toggle('detail-focus-left', !rightFocused && Boolean(event.target.closest('.detail-summary')));
});
document.addEventListener('keydown', (event) => {
  if (state.busy) {
    event.preventDefault();
    return;
  }
  const backKeys = ['Escape', 'Backspace', 'BrowserBack', 'GoBack', 'Back', 'MediaBack'];
  if (backKeys.includes(event.key) && !(event.target instanceof HTMLInputElement && event.key === 'Backspace')) {
    event.preventDefault();
    handleBack();
    return;
  }
  if (event.key === 'Enter' || event.key === 'NumpadEnter') {
    const target = document.activeElement;
    if (target instanceof HTMLInputElement) {
      const actionId = target.id === 'share-code' ? 'import-submit' : target.id === 'recipe-name' ? 'name-next' : '';
      if (actionId) {
        event.preventDefault();
        const action = modalRoot.querySelector(`#${actionId}`) || document.querySelector(`#${actionId}`);
        action?.click();
      }
      return;
    }
    if (target instanceof HTMLButtonElement) {
      event.preventDefault();
      target.click();
      return;
    }
  }
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  if (document.activeElement?.matches('input')) return;
  if (handleDetailArrowKey(event.key)) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  focusInDirection(event.key.slice(5).toLowerCase());
});

removeLegacyAutoBackups();
normalizeImportedRecipeSources();
normalizeRecipeInputSources();
migrateAppliedContextKeys();
migrateCurrentRecipe();
ensureImportedShareCodes();
ensureCloudShareSnapshots();
updateDisplayScale();
setSecurityHome();
