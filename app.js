const APP_VERSION = "1.2.0";
const PREF_KEY = "ncm.studio.prefs";
const IDB_NAME = "ncm-studio";
const LAST = 3;

const I18N = {
  zh: {
    appTitle: "NCM Studio",
    appSubtitle: "批量解密网易云 NCM，输出原声 MP3 / FLAC",
    s0Title: "选择来源",
    s0Lead: "可一次勾选多个 NCM 文件，或授权一个目录并扫描其中全部 NCM。",
    modeFiles: "批量选择文件",
    modeFilesHint: "使用系统文件框，适合零散曲目。",
    modeFolder: "指定目录",
    modeFolderHint: "授权文件夹后可写回同目录，并允许删除源文件。",
    pathLabel: "已记忆的目录",
    browse: "浏览",
    scan: "扫描",
    exportLabel: "导出目录",
    exportHint: "与源目录分开记忆。请用 start.bat / start.sh 打开本页后填写磁盘路径。",
    bannerFile: "当前是 file:// 打开。Chrome 会拒绝含系统文件的文件夹。请双击 start.bat（或运行 start.sh）以 http://127.0.0.1:8765 打开，即可填写并记忆源路径与导出路径。",
    bannerLocal: "本地服务已连接，可直接填写磁盘路径。",
    scanFail: "无法扫描该目录：{err}",
    hintPath: "路径「{name}」中发现 {n} 个 NCM。",
    next: "下一步",
    back: "上一步",
    s1Title: "转换选项",
    s1Lead: "先解密容器，再选择输出封装。原格式保持内嵌编码；WAV 为解码后的 PCM。",
    fmtOrig: "原格式",
    fmtOrigHint: "按容器内的 MP3 / FLAC 直接写出",
    fmtMp3Hint: "源为 MP3 时原样保存；源为 FLAC 时请改用 WAV",
    fmtWavHint: "解码为 16-bit PCM，剪辑软件时间轴更稳",
    fmtFlacToMp3: "源文件是 FLAC，无法在浏览器内编码为 MP3，已按原格式保存。",
    optMeta: "写入标题 / 艺术家 / 专辑",
    optMetaHint: "在尚未带标签的 MP3 前写入 ID3v2。",
    optRemember: "记住本次选择",
    optRememberHint: "下次打开时恢复来源方式、目录授权与选项。",
    optDelete: "转换成功后删除源目录中的 NCM",
    optDeleteHint: "默认关闭。仅在已授权可写目录时生效；文件选择模式无法删除原件。",
    s2Title: "确认并转换",
    run: "开始转换",
    s3Title: "完成",
    again: "再转一批",
    downloadAll: "下载未写入的文件",
    step0: "来源",
    step1: "选项",
    step2: "转换",
    step3: "完成",
    hintFiles: "已选择 {n} 个 NCM 文件。文件模式下转换结果将触发浏览器下载。",
    hintFolder: "目录「{name}」中发现 {n} 个 NCM。输出将写入同一目录。",
    hintNeedSecure: "目录授权需要安全上下文。请用本目录中的 start 脚本以本地服务器打开，或改用批量选文件。",
    hintNoApi: "当前浏览器不支持目录授权。请改用 Chrome / Edge，或改用批量选文件。",
    hintEmpty: "尚未选择任何 NCM。",
    listLead: "下列 {n} 个文件将按选项处理。",
    doneOk: "成功 {ok} 个，失败 {err} 个。",
    deleted: "已删除源文件",
    wrote: "已写入目录",
    downloaded: "已下载",
    idle: "等待开始。",
    running: "正在处理 {name}",
    doneItem: "完成",
    failItem: "失败",
    restoreAsk: "发现上次目录授权，正在恢复权限。",
    noPendingDl: "全部文件已写入所选目录，无需额外下载。"
  },
  en: {
    appTitle: "NCM Studio",
    appSubtitle: "Batch-dump NetEase NCM containers to MP3 / FLAC",
    s0Title: "Choose source",
    s0Lead: "Pick multiple NCM files, or grant a folder and scan every NCM inside it.",
    modeFiles: "Select files",
    modeFilesHint: "Use the system picker for scattered tracks.",
    modeFolder: "Grant a folder",
    modeFolderHint: "Write results beside the sources and optionally delete the NCM files.",
    pathLabel: "Remembered folder",
    browse: "Browse",
    scan: "Scan",
    exportLabel: "Export folder",
    exportHint: "Remembered separately from the source. Type a disk path after opening via start.bat / start.sh.",
    bannerFile: "This page was opened as file://. Chrome blocks folders that contain system files. Run start.bat or start.sh and use http://127.0.0.1:8765 so typed source and export paths work.",
    bannerLocal: "Local helper is connected. Disk paths can be typed.",
    scanFail: "Cannot scan that folder: {err}",
    hintPath: "Path “{name}” contains {n} NCM file(s).",
    next: "Next",
    back: "Back",
    s1Title: "Options",
    s1Lead: "Dump the container first, then choose the output wrapper. Original keeps the payload; WAV is decoded PCM.",
    fmtOrig: "Original",
    fmtOrigHint: "Write the MP3 or FLAC stored in the container",
    fmtMp3Hint: "Copied when the payload is already MP3. Use WAV for FLAC sources.",
    fmtWavHint: "Decode to 16-bit PCM for editors that misread broken MP3 headers",
    fmtFlacToMp3: "Source is FLAC. This page cannot encode MP3; kept the original payload.",
    optMeta: "Write title / artist / album",
    optMetaHint: "Prepend ID3v2 when the dumped MP3 has no tag yet.",
    optRemember: "Remember this session",
    optRememberHint: "Restore source mode, folder grant, and checkboxes on the next visit.",
    optDelete: "Delete source NCM files after success",
    optDeleteHint: "Off by default. Requires a writable folder grant. File-picker mode cannot delete originals.",
    s2Title: "Confirm and convert",
    run: "Convert",
    s3Title: "Done",
    again: "Convert another batch",
    downloadAll: "Download files not written to disk",
    step0: "Source",
    step1: "Options",
    step2: "Convert",
    step3: "Done",
    hintFiles: "{n} NCM file(s) selected. Results will download in the browser.",
    hintFolder: "Folder “{name}” contains {n} NCM file(s). Output is written in place.",
    hintNeedSecure: "Folder access needs a secure context. Serve this folder with the bundled start script, or switch to file selection.",
    hintNoApi: "This browser cannot grant folders. Use Chrome / Edge, or select files instead.",
    hintEmpty: "No NCM files selected yet.",
    listLead: "{n} file(s) will be processed with the current options.",
    doneOk: "{ok} succeeded, {err} failed.",
    deleted: "source removed",
    wrote: "written to folder",
    downloaded: "downloaded",
    idle: "Waiting.",
    running: "Working on {name}",
    doneItem: "done",
    failItem: "failed",
    restoreAsk: "A previous folder grant was found. Requesting permission again.",
    noPendingDl: "Every file was written into the granted folder."
  }
};

const state = {
  lang: "zh",
  step: 0,
  mode: "files",
  files: [],
  dirHandle: null,
  exportHandle: null,
  dirName: "",
  sourcePath: "",
  exportPath: "",
  api: false,
  results: [],
  running: false
};

function detectUiLang() {
  const saved = localStorage.getItem("aio.uiLang");
  if (saved === "zh" || saved === "en") return saved;
  return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}

function t(key, vars) {
  let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.zh[key] || key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  return s;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("#uiLangSwitch button").forEach((b) => {
    b.classList.toggle("on", b.getAttribute("data-ui-lang") === state.lang);
  });
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  renderStepNav();
  refreshHints();
}

function renderStepNav() {
  const nav = document.getElementById("stepNav");
  const labels = [t("step0"), t("step1"), t("step2"), t("step3")];
  nav.innerHTML = "";
  labels.forEach((label, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = String(i + 1).padStart(2, "0") + " " + label;
    if (i === state.step) b.classList.add("on");
    if (i < state.step) b.classList.add("ok");
    b.addEventListener("click", () => {
      if (i <= state.step && !state.running) goStep(i);
    });
    nav.appendChild(b);
  });
}

function hideAllStages() {
  for (let i = 0; i <= LAST; i++) document.getElementById("stage" + i)?.classList.remove("on");
}

function goStep(n) {
  state.step = n;
  hideAllStages();
  document.getElementById("stage" + n)?.classList.add("on");
  renderStepNav();
  applyI18n();
  if (n === 2) renderList();
}

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePrefs() {
  if (!document.getElementById("optRemember").checked) return;
  const payload = {
    mode: state.mode,
    dirName: state.dirName,
    sourcePath: document.getElementById("pathView").value.trim() || state.sourcePath,
    exportPath: document.getElementById("exportView").value.trim() || state.exportPath,
    deleteSource: document.getElementById("optDelete").checked,
    writeMeta: document.getElementById("optMeta").checked,
    format: selectedFormat(),
    remember: true
  };
  state.sourcePath = payload.sourcePath;
  state.exportPath = payload.exportPath;
  localStorage.setItem(PREF_KEY, JSON.stringify(payload));
  if (state.api) {
    fetch("/api/prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }
}

async function detectApi() {
  if (location.protocol === "file:") {
    state.api = false;
    const banner = document.getElementById("ctxBanner");
    banner.hidden = false;
    banner.className = "banner";
    banner.textContent = t("bannerFile");
    return;
  }
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    state.api = !!(data && data.ok);
    const banner = document.getElementById("ctxBanner");
    banner.hidden = false;
    banner.className = "banner ok";
    banner.textContent = t("bannerLocal");
    if (data.prefs) applyServerPrefs(data.prefs);
  } catch {
    state.api = false;
    if (location.protocol === "file:") {
      const banner = document.getElementById("ctxBanner");
      banner.hidden = false;
      banner.className = "banner";
      banner.textContent = t("bannerFile");
    }
  }
}

function applyServerPrefs(prefs) {
  if (!prefs) return;
  if (prefs.sourcePath) {
    state.sourcePath = prefs.sourcePath;
    document.getElementById("pathView").value = prefs.sourcePath;
  }
  if (prefs.exportPath) {
    state.exportPath = prefs.exportPath;
    document.getElementById("exportView").value = prefs.exportPath;
  }
  if (prefs.mode) setMode(prefs.mode);
  if (prefs.format) setFormat(prefs.format);
  if (prefs.deleteSource) document.getElementById("optDelete").checked = true;
  if (prefs.writeMeta === false) document.getElementById("optMeta").checked = false;
}

function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("kv");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const req = tx.objectStore("kv").get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function hasDirApi() {
  return typeof window.showDirectoryPicker === "function";
}

function isSecure() {
  return window.isSecureContext;
}

function setMode(mode) {
  state.mode = mode;
  document.getElementById("modeFiles").classList.toggle("on", mode === "files");
  document.getElementById("modeFolder").classList.toggle("on", mode === "folder");
  refreshHints();
}

function refreshHints() {
  const hint = document.getElementById("sourceHint");
  const pathView = document.getElementById("pathView");
  const shown = pathView.value.trim() || state.sourcePath || state.dirName || "";
  if (pathView.value !== shown && shown) pathView.value = shown;
  if (state.exportPath && !document.getElementById("exportView").value) {
    document.getElementById("exportView").value = state.exportPath;
  }
  if (state.mode === "files") {
    hint.textContent = state.files.length ? t("hintFiles", { n: state.files.length }) : t("hintEmpty");
  } else if (state.files.length) {
    hint.textContent = t("hintPath", { name: shown || state.dirName || "—", n: state.files.length });
  } else if (location.protocol === "file:" && !state.api) {
    hint.textContent = t("bannerFile");
  } else {
    hint.textContent = t("hintEmpty");
  }
  const canDelete = state.mode === "folder" && (state.api || !!state.dirHandle);
  document.getElementById("optDelete").disabled = !canDelete;
  document.getElementById("optHint").textContent = canDelete ? "" : t("optDeleteHint");
  document.getElementById("next0").disabled = state.files.length === 0;
}

function selectedFormat() {
  const el = document.querySelector("input[name=fmt]:checked");
  return (el && el.value) || "original";
}

function setFormat(fmt) {
  document.querySelectorAll("input[name=fmt]").forEach((r) => {
    r.checked = r.value === fmt;
    r.closest(".fmt")?.classList.toggle("on", r.checked);
  });
}

async function audioToWav(bytes) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await ctx.decodeAudioData(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const channels = decoded.numberOfChannels;
  const rate = decoded.sampleRate;
  const frames = decoded.length;
  const pcm = new Float32Array(frames * channels);
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) pcm[i * channels + c] = decoded.getChannelData(c)[i];
  }
  try { await ctx.close(); } catch (_) {}
  return NcmDump.writeWav(pcm, rate, channels);
}

async function applyOutputFormat(dumped, fmt) {
  if (fmt === "original" || !fmt) return dumped;
  if (fmt === "mp3") {
    if (dumped.ext === "mp3") {
      dumped.fileName = dumped.fileName.replace(/\.[^.]+$/, ".mp3");
      return dumped;
    }
    logLine(t("fmtFlacToMp3"));
    return dumped;
  }
  if (fmt === "wav") {
    const wav = await audioToWav(dumped.audio);
    dumped.audio = wav;
    dumped.ext = "wav";
    dumped.fileName = dumped.fileName.replace(/\.[^.]+$/, ".wav");
    dumped.bytesOut = wav.length;
    dumped.written = false;
  }
  return dumped;
}

function fileEntry(file, handle) {
  return { file, handle, name: file.name };
}

async function collectFromDir(dirHandle) {
  const out = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "file" && /\.ncm$/i.test(name)) {
      out.push(fileEntry(await handle.getFile(), handle));
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  return out;
}

async function pickFiles() {
  const input = document.getElementById("fileInput");
  input.value = "";
  input.click();
}

async function pickFolder() {
  if (location.protocol === "file:") {
    alert(t("bannerFile"));
    return;
  }
  if (!hasDirApi()) {
    alert(t("hintNoApi"));
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    state.dirHandle = handle;
    state.dirName = handle.name;
    state.sourcePath = handle.name;
    document.getElementById("pathView").value = handle.name;
    state.files = await collectFromDir(handle);
    if (document.getElementById("optRemember").checked) {
      try { await idbSet("dirHandle", handle); } catch (_) {}
    }
    setMode("folder");
    savePrefs();
    refreshHints();
  } catch (err) {
    alert(t("scanFail", { err: err && err.message ? err.message : String(err) }));
  }
}

async function pickExportFolder() {
  if (location.protocol === "file:") {
    alert(t("bannerFile"));
    return;
  }
  if (!hasDirApi()) {
    alert(t("hintNoApi"));
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    state.exportHandle = handle;
    state.exportPath = handle.name;
    document.getElementById("exportView").value = handle.name;
    if (document.getElementById("optRemember").checked) {
      try { await idbSet("exportHandle", handle); } catch (_) {}
    }
    savePrefs();
  } catch (err) {
    alert(t("scanFail", { err: err && err.message ? err.message : String(err) }));
  }
}

async function scanTypedPath() {
  const path = document.getElementById("pathView").value.trim();
  if (!path) {
    alert(t("hintEmpty"));
    return;
  }
  if (!state.api) {
    alert(t("bannerFile"));
    return;
  }
  try {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "scan");
    state.sourcePath = data.path;
    document.getElementById("pathView").value = data.path;
    state.files = (data.files || []).map((f) => ({
      file: null,
      handle: null,
      name: f.name,
      path: f.path,
      size: f.size
    }));
    setMode("folder");
    savePrefs();
    refreshHints();
  } catch (err) {
    alert(t("scanFail", { err: err && err.message ? err.message : String(err) }));
  }
}

document.getElementById("fileInput").addEventListener("change", (e) => {
  const list = Array.from(e.target.files || []).filter((f) => /\.ncm$/i.test(f.name));
  state.files = list.map((f) => fileEntry(f, null));
  refreshHints();
});

function renderList() {
  document.getElementById("listLead").textContent = t("listLead", { n: state.files.length });
  const box = document.getElementById("fileList");
  box.innerHTML = "";
  state.files.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "row";
    row.id = "row-" + i;
    row.innerHTML = `<span>${escapeHtml(item.name)}</span><span class="st" id="st-${i}">—</span>`;
    box.appendChild(row);
  });
  document.getElementById("log").textContent = t("idle");
  document.getElementById("bar").style.width = "0%";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function logLine(msg) {
  const el = document.getElementById("log");
  el.textContent += (el.textContent ? "\n" : "") + msg;
  el.scrollTop = el.scrollHeight;
}

function downloadBlob(name, bytes) {
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function writeToDir(name, bytes) {
  await writeToHandle(state.dirHandle, name, bytes);
}

async function writeToHandle(dirHandle, name, bytes) {
  const fh = await dirHandle.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(bytes);
  await w.close();
}

async function removeSource(item) {
  if (state.api && item.path) {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: item.path })
    });
    const data = await res.json();
    return !!(data && data.ok);
  }
  if (!state.dirHandle || !item.handle) return false;
  try {
    await state.dirHandle.removeEntry(item.name);
    return true;
  } catch {
    try {
      if (item.handle.remove) {
        await item.handle.remove();
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

async function runConvert() {
  if (state.running || !state.files.length) return;
  state.running = true;
  document.getElementById("runBtn").disabled = true;
  const writeMeta = document.getElementById("optMeta").checked;
  const del = document.getElementById("optDelete").checked && state.mode === "folder" && (!!state.dirHandle || (state.api && state.files.some((f) => f.path)));
  const fmt = selectedFormat();
  state.results = [];
  let ok = 0, err = 0;
  for (let i = 0; i < state.files.length; i++) {
    const item = state.files[i];
    document.getElementById("st-" + i).textContent = t("running", { name: item.name });
    logLine(t("running", { name: item.name }));
    try {
      let buf;
      if (!item.file && item.path && state.api) {
        const res = await fetch("/api/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: item.path })
        });
        if (!res.ok) throw new Error("read failed");
        buf = await res.arrayBuffer();
      } else {
        buf = await item.file.arrayBuffer();
      }
      let dumped = await NcmDump.dumpBuffer(buf, item.name, { writeMeta });
      dumped = await applyOutputFormat(dumped, fmt);
      let action = t("downloaded");
      const exportPath = document.getElementById("exportView").value.trim() || state.exportPath;
      if (state.api && exportPath) {
        await fetch("/api/write?dir=" + encodeURIComponent(exportPath) + "&name=" + encodeURIComponent(dumped.fileName), {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: dumped.audio
        }).then(async (res) => {
          const data = await res.json();
          if (!data.ok) throw new Error(data.error || "write");
        });
        action = t("wrote");
        dumped.written = true;
      } else if (state.exportHandle) {
        await writeToHandle(state.exportHandle, dumped.fileName, dumped.audio);
        action = t("wrote");
        dumped.written = true;
      } else if (state.dirHandle) {
        await writeToDir(dumped.fileName, dumped.audio);
        action = t("wrote");
        dumped.written = true;
      } else {
        downloadBlob(dumped.fileName, dumped.audio);
        dumped.written = false;
      }
      let removed = false;
      if (del) removed = await removeSource(item);
      document.getElementById("st-" + i).className = "st ok";
      document.getElementById("st-" + i).textContent = t("doneItem") + (removed ? " · " + t("deleted") : "");
      logLine(item.name + " → " + dumped.fileName + " (" + action + ")");
      state.results.push({ ok: true, item, dumped, removed });
      ok++;
    } catch (e) {
      err++;
      document.getElementById("st-" + i).className = "st err";
      document.getElementById("st-" + i).textContent = t("failItem");
      logLine(item.name + " · " + (e && e.message ? e.message : String(e)));
      state.results.push({ ok: false, item, error: e });
    }
    document.getElementById("bar").style.width = Math.round(((i + 1) / state.files.length) * 100) + "%";
    await new Promise((r) => setTimeout(r, 20));
  }
  state.running = false;
  document.getElementById("runBtn").disabled = false;
  document.getElementById("doneLead").textContent = t("doneOk", { ok, err });
  const box = document.getElementById("resultList");
  box.innerHTML = "";
  state.results.forEach((r) => {
    const row = document.createElement("div");
    row.className = "row";
    const name = r.ok ? r.dumped.fileName : r.item.name;
    const st = r.ok ? (r.removed ? t("deleted") : (r.dumped.written ? t("wrote") : t("downloaded"))) : t("failItem");
    row.innerHTML = `<span>${escapeHtml(name)}</span><span class="st ${r.ok ? "ok" : "err"}">${escapeHtml(st)}</span>`;
    box.appendChild(row);
  });
  goStep(3);
}

async function downloadPending() {
  const pending = state.results.filter((r) => r.ok && r.dumped && !r.dumped.written);
  if (!pending.length) {
    alert(t("noPendingDl"));
    return;
  }
  for (const r of pending) downloadBlob(r.dumped.fileName, r.dumped.audio);
}

async function restoreSession() {
  const prefs = loadPrefs();
  if (prefs.writeMeta === false) document.getElementById("optMeta").checked = false;
  if (prefs.deleteSource) document.getElementById("optDelete").checked = true;
  if (prefs.remember === false) document.getElementById("optRemember").checked = false;
  if (prefs.format) setFormat(prefs.format);
  if (prefs.mode === "folder") setMode("folder");
  if (prefs.dirName) state.dirName = prefs.dirName;
  if (prefs.sourcePath) {
    state.sourcePath = prefs.sourcePath;
    document.getElementById("pathView").value = prefs.sourcePath;
  }
  if (prefs.exportPath) {
    state.exportPath = prefs.exportPath;
    document.getElementById("exportView").value = prefs.exportPath;
  }
  try {
    const exportHandle = await idbGet("exportHandle");
    if (exportHandle && exportHandle.requestPermission) {
      const perm = await exportHandle.requestPermission({ mode: "readwrite" });
      if (perm === "granted") {
        state.exportHandle = exportHandle;
        if (!state.exportPath) {
          state.exportPath = exportHandle.name;
          document.getElementById("exportView").value = exportHandle.name;
        }
      }
    }
    if (state.api && (document.getElementById("pathView").value.trim() || state.sourcePath)) {
      try { await scanTypedPath(); } catch (_) {}
    }
    const handle = await idbGet("dirHandle");
    if (handle && handle.requestPermission) {
      logSilent();
      const perm = await handle.requestPermission({ mode: "readwrite" });
      if (perm === "granted") {
        state.dirHandle = handle;
        state.dirName = handle.name;
        setMode("folder");
        state.files = await collectFromDir(handle);
      }
    }
  } catch (_) {}
  refreshHints();
}

function logSilent() {}

function bind() {
  document.getElementById("appVersion").textContent = "v" + APP_VERSION;
  state.lang = detectUiLang();
  document.getElementById("uiLangSwitch").addEventListener("click", (e) => {
    const lang = e.target.getAttribute("data-ui-lang");
    if (!lang) return;
    state.lang = lang;
    localStorage.setItem("aio.uiLang", lang);
    applyI18n();
  });
  document.getElementById("modeFiles").addEventListener("click", () => setMode("files"));
  document.getElementById("modeFolder").addEventListener("click", () => setMode("folder"));
  document.getElementById("pickBtn").addEventListener("click", () => {
    if (state.mode === "folder") pickFolder();
    else pickFiles();
  });
  document.getElementById("scanBtn").addEventListener("click", scanTypedPath);
  document.getElementById("pickExportBtn").addEventListener("click", pickExportFolder);
  document.getElementById("pathView").addEventListener("change", savePrefs);
  document.getElementById("exportView").addEventListener("change", savePrefs);
  document.getElementById("next0").addEventListener("click", () => {
    savePrefs();
    goStep(1);
  });
  document.getElementById("back1").addEventListener("click", () => goStep(0));
  document.getElementById("next1").addEventListener("click", () => {
    savePrefs();
    goStep(2);
  });
  document.getElementById("back2").addEventListener("click", () => goStep(1));
  document.getElementById("runBtn").addEventListener("click", runConvert);
  document.getElementById("againBtn").addEventListener("click", () => {
    state.results = [];
    goStep(0);
  });
  document.getElementById("dlBtn").addEventListener("click", downloadPending);
  ["optDelete", "optMeta", "optRemember"].forEach((id) => {
    document.getElementById(id).addEventListener("change", savePrefs);
  });
  document.getElementById("fmtGrid").addEventListener("change", () => {
    setFormat(selectedFormat());
    savePrefs();
  });
  applyI18n();
  detectApi().then(() => restoreSession());
}

bind();
