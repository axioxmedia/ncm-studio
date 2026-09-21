/* NCM container dump — AES-128-ECB + NetEase key-box.
   Compatible with anonymous5l / taurusxin / ncmdump-py. */
(function (root) {
  "use strict";

  const CORE_KEY = hexToBytes("687A4852416D736F356B496E62617857");
  const META_KEY = hexToBytes("2331346C6A6B5F215C5D2630553C2728");
  const MAGIC = [0x43, 0x54, 0x45, 0x4e, 0x46, 0x44, 0x41, 0x4d];

  function hexToBytes(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }

  /* ---- AES-128 ECB (PKCS7 unpad after decrypt) ---- */
  const SBOX = new Uint8Array([
    99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22
  ]);
  const RCON = new Uint8Array([0,1,2,4,8,16,32,64,128,27,54]);

  function expandKey(key) {
    const w = new Uint8Array(176);
    w.set(key);
    for (let i = 4; i < 44; i++) {
      let t0 = w[(i - 1) * 4], t1 = w[(i - 1) * 4 + 1], t2 = w[(i - 1) * 4 + 2], t3 = w[(i - 1) * 4 + 3];
      if (i % 4 === 0) {
        const a = t0;
        t0 = SBOX[t1] ^ RCON[i / 4];
        t1 = SBOX[t2];
        t2 = SBOX[t3];
        t3 = SBOX[a];
      }
      w[i * 4] = w[(i - 4) * 4] ^ t0;
      w[i * 4 + 1] = w[(i - 4) * 4 + 1] ^ t1;
      w[i * 4 + 2] = w[(i - 4) * 4 + 2] ^ t2;
      w[i * 4 + 3] = w[(i - 4) * 4 + 3] ^ t3;
    }
    return w;
  }

  const INV_SBOX = (function () {
    const t = new Uint8Array(256);
    for (let i = 0; i < 256; i++) t[SBOX[i]] = i;
    return t;
  })();

  function gmul(a, b) {
    let p = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      const hi = a & 0x80;
      a = (a << 1) & 0xff;
      if (hi) a ^= 0x1b;
      b >>= 1;
    }
    return p;
  }

  function invShiftRows(s) {
    const t = new Uint8Array(16);
    t[0] = s[0]; t[4] = s[4]; t[8] = s[8]; t[12] = s[12];
    t[1] = s[13]; t[5] = s[1]; t[9] = s[5]; t[13] = s[9];
    t[2] = s[10]; t[6] = s[14]; t[10] = s[2]; t[14] = s[6];
    t[3] = s[7]; t[7] = s[11]; t[11] = s[15]; t[15] = s[3];
    s.set(t);
  }

  function invMixColumns(s) {
    for (let c = 0; c < 4; c++) {
      const i = c * 4;
      const a = s[i], b = s[i + 1], d = s[i + 2], e = s[i + 3];
      s[i] = gmul(a, 14) ^ gmul(b, 11) ^ gmul(d, 13) ^ gmul(e, 9);
      s[i + 1] = gmul(a, 9) ^ gmul(b, 14) ^ gmul(d, 11) ^ gmul(e, 13);
      s[i + 2] = gmul(a, 13) ^ gmul(b, 9) ^ gmul(d, 14) ^ gmul(e, 11);
      s[i + 3] = gmul(a, 11) ^ gmul(b, 13) ^ gmul(d, 9) ^ gmul(e, 14);
    }
  }

  function decryptBlock(rk, block, offset) {
    const s = new Uint8Array(16);
    for (let i = 0; i < 16; i++) s[i] = block[offset + i] ^ rk[160 + i];
    for (let round = 9; round >= 1; round--) {
      invShiftRows(s);
      for (let i = 0; i < 16; i++) s[i] = INV_SBOX[s[i]];
      for (let i = 0; i < 16; i++) s[i] ^= rk[round * 16 + i];
      invMixColumns(s);
    }
    invShiftRows(s);
    for (let i = 0; i < 16; i++) s[i] = INV_SBOX[s[i]];
    for (let i = 0; i < 16; i++) block[offset + i] = s[i] ^ rk[i];
  }

  function aesEcbDecrypt(key, data) {
    if (data.length % 16 !== 0) throw new Error("AES block length");
    const rk = expandKey(key);
    const out = new Uint8Array(data);
    for (let i = 0; i < out.length; i += 16) decryptBlock(rk, out, i);
    return pkcs7Unpad(out);
  }

  function pkcs7Unpad(buf) {
    if (!buf.length) return buf;
    const pad = buf[buf.length - 1];
    if (pad < 1 || pad > 16) return buf;
    for (let i = 1; i <= pad; i++) {
      if (buf[buf.length - i] !== pad) return buf;
    }
    return buf.subarray(0, buf.length - pad);
  }

  function readU32LE(view, offset) {
    return view.getUint32(offset, true);
  }

  function xorBytes(buf, byte) {
    const out = new Uint8Array(buf);
    for (let i = 0; i < out.length; i++) out[i] ^= byte;
    return out;
  }

  function buildKeyBox(key) {
    const box = new Uint8Array(256);
    for (let i = 0; i < 256; i++) box[i] = i;
    let last = 0;
    let keyOffset = 0;
    const keyLen = key.length;
    for (let i = 0; i < 256; i++) {
      const swap = box[i];
      const c = (swap + last + key[keyOffset]) & 0xff;
      keyOffset++;
      if (keyOffset >= keyLen) keyOffset = 0;
      box[i] = box[c];
      box[c] = swap;
      last = c;
    }
    const pre = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      pre[i] = box[(box[i] + box[(i + box[i]) & 0xff]) & 0xff];
    }
    return pre;
  }

  function isAudioMagic(audio) {
    if (!audio || audio.length < 4) return false;
    if (audio[0] === 0x66 && audio[1] === 0x4c && audio[2] === 0x61 && audio[3] === 0x43) return true;
    if (audio[0] === 0x49 && audio[1] === 0x44 && audio[2] === 0x33) return true;
    if (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0) return true;
    if (audio[0] === 0x4f && audio[1] === 0x67 && audio[2] === 0x67 && audio[3] === 0x53) return true;
    if (audio[0] === 0x52 && audio[1] === 0x49 && audio[2] === 0x46 && audio[3] === 0x46) return true;
    return false;
  }

  function peekDecrypt(bytes, offset, keyBox, n) {
    const out = new Uint8Array(Math.min(n, Math.max(0, bytes.length - offset)));
    for (let i = 0; i < out.length; i++) out[i] = bytes[offset + i] ^ keyBox[(i + 1) & 0xff];
    return out;
  }

  function jpegOrPng(buf) {
    if (!buf || buf.length < 4) return false;
    if (buf[0] === 0xff && buf[1] === 0xd8) return true;
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
    return false;
  }

  function locateAudio(bytes, afterCrc, keyBox) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const candidates = [];

    function add(audioOff, coverOff, coverLen, why) {
      if (audioOff < 0 || audioOff >= bytes.length) return;
      candidates.push({ audioOff, coverOff, coverLen, why });
    }

    if (afterCrc + 9 <= bytes.length) {
      const lenClassic = readU32LE(view, afterCrc + 5);
      add(afterCrc + 9 + (lenClassic || 0), afterCrc + 9, lenClassic || 0, "classic-skip5");
    }
    if (afterCrc + 9 <= bytes.length && bytes[afterCrc] === 0x01) {
      const len1 = readU32LE(view, afterCrc + 1);
      const len2 = readU32LE(view, afterCrc + 5);
      const coverLen = len1 > 0 ? len1 : len2;
      add(afterCrc + 9 + coverLen, afterCrc + 9, coverLen, "sep01-dual-len");
      if (len1 > 0) add(afterCrc + 5 + len1, afterCrc + 5, len1, "sep01-single-len");
    }

    let best = null;
    for (const c of candidates) {
      const head = peekDecrypt(bytes, c.audioOff, keyBox, 16);
      if (isAudioMagic(head)) {
        best = c;
        break;
      }
    }
    if (!best) best = candidates[0] || { audioOff: afterCrc + 9, coverOff: afterCrc + 9, coverLen: 0 };

    let cover = null;
    if (best.coverLen > 0 && best.coverOff + best.coverLen <= bytes.length) {
      const raw = bytes.subarray(best.coverOff, best.coverOff + best.coverLen);
      cover = jpegOrPng(raw) ? raw : null;
    }
    return { audioOff: best.audioOff, cover };
  }

  function detectExt(audio, metaFormat) {
    if (audio.length >= 4) {
      if (audio[0] === 0x66 && audio[1] === 0x4c && audio[2] === 0x61 && audio[3] === 0x43) return "flac";
      if (audio[0] === 0x49 && audio[1] === 0x44 && audio[2] === 0x33) return "mp3";
      if (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0) return "mp3";
      if (audio[0] === 0x4f && audio[1] === 0x67 && audio[2] === 0x67 && audio[3] === 0x53) return "ogg";
      if (audio[0] === 0x52 && audio[1] === 0x49 && audio[2] === 0x46 && audio[3] === 0x46) return "wav";
    }
    if (metaFormat === "flac" || metaFormat === "mp3" || metaFormat === "ogg" || metaFormat === "wav") return metaFormat;
    return "mp3";
  }

  function encodeSynchsafe(n) {
    return [
      (n >> 21) & 0x7f,
      (n >> 14) & 0x7f,
      (n >> 7) & 0x7f,
      n & 0x7f
    ];
  }

  function id3Frame(id, text) {
    const body = new TextEncoder().encode("\u0003" + text + "\u0000");
    const len = body.length;
    const out = new Uint8Array(10 + len);
    out[0] = id.charCodeAt(0);
    out[1] = id.charCodeAt(1);
    out[2] = id.charCodeAt(2);
    out[3] = id.charCodeAt(3);
    out[4] = (len >> 24) & 0xff;
    out[5] = (len >> 16) & 0xff;
    out[6] = (len >> 8) & 0xff;
    out[7] = len & 0xff;
    out.set(body, 10);
    return out;
  }

  function buildId3(meta, cover) {
    const frames = [];
    if (meta.musicName) frames.push(id3Frame("TIT2", String(meta.musicName)));
    let artist = "";
    if (Array.isArray(meta.artist)) {
      artist = meta.artist.map((a) => (Array.isArray(a) ? a[0] : a)).filter(Boolean).join("/");
    } else if (meta.artist) artist = String(meta.artist);
    if (artist) frames.push(id3Frame("TPE1", artist));
    if (meta.album) frames.push(id3Frame("TALB", String(meta.album)));
    if (cover && cover.length) {
      const mime = cover[0] === 0x89 ? "image/png" : "image/jpeg";
      const mimeB = new TextEncoder().encode(mime);
      const desc = new Uint8Array(0);
      const payload = new Uint8Array(1 + mimeB.length + 1 + 1 + 1 + desc.length + cover.length);
      let p = 0;
      payload[p++] = 0;
      payload.set(mimeB, p); p += mimeB.length;
      payload[p++] = 0;
      payload[p++] = 3;
      payload[p++] = 0;
      payload.set(cover, p);
      const len = payload.length;
      const fr = new Uint8Array(10 + len);
      fr[0] = 65; fr[1] = 80; fr[2] = 73; fr[3] = 67;
      fr[4] = (len >> 24) & 0xff;
      fr[5] = (len >> 16) & 0xff;
      fr[6] = (len >> 8) & 0xff;
      fr[7] = len & 0xff;
      fr.set(payload, 10);
      frames.push(fr);
    }
    let bodyLen = 0;
    for (const f of frames) bodyLen += f.length;
    const header = new Uint8Array(10);
    header[0] = 0x49; header[1] = 0x44; header[2] = 0x33;
    header[3] = 3; header[4] = 0; header[5] = 0;
    const ss = encodeSynchsafe(bodyLen);
    header[6] = ss[0]; header[7] = ss[1]; header[8] = ss[2]; header[9] = ss[3];
    const out = new Uint8Array(10 + bodyLen);
    out.set(header, 0);
    let o = 10;
    for (const f of frames) {
      out.set(f, o);
      o += f.length;
    }
    return out;
  }

  function looksTagged(audio) {
    return audio.length >= 3 && audio[0] === 0x49 && audio[1] === 0x44 && audio[2] === 0x33;
  }

  async function dumpBuffer(arrayBuffer, fileName, options) {
    const opts = options || {};
    const writeMeta = opts.writeMeta !== false;
    const bytes = new Uint8Array(arrayBuffer);
    if (bytes.length < 16) throw new Error("file too small");
    for (let i = 0; i < 8; i++) {
      if (bytes[i] !== MAGIC[i]) throw new Error("not an NCM file");
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let off = 10;
    const keyLen = readU32LE(view, off); off += 4;
    if (keyLen <= 0 || off + keyLen > bytes.length) throw new Error("bad key block");
    const keyEnc = xorBytes(bytes.subarray(off, off + keyLen), 0x64);
    off += keyLen;
    const keyPlain = aesEcbDecrypt(CORE_KEY, keyEnc);
    const prefix = "neteasecloudmusic";
    let rc4Key = keyPlain;
    const head = new TextDecoder().decode(keyPlain.subarray(0, Math.min(17, keyPlain.length)));
    if (head === prefix) rc4Key = keyPlain.subarray(17);
    if (!rc4Key.length) throw new Error("empty RC4 key");

    const metaLen = readU32LE(view, off); off += 4;
    let meta = {};
    if (metaLen > 0) {
      if (off + metaLen > bytes.length) throw new Error("bad meta block");
      const metaXor = xorBytes(bytes.subarray(off, off + metaLen), 0x63);
      off += metaLen;
      const marker = "163 key(Don't modify):";
      const markerB = new TextEncoder().encode(marker);
      let b64 = metaXor;
      let same = metaXor.length > markerB.length;
      if (same) {
        for (let i = 0; i < markerB.length; i++) if (metaXor[i] !== markerB[i]) same = false;
      }
      if (same) b64 = metaXor.subarray(markerB.length);
      const ascii = new TextDecoder().decode(b64);
      let bin;
      try {
        const raw = atob(ascii.replace(/\s+/g, ""));
        bin = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bin[i] = raw.charCodeAt(i);
      } catch (e) {
        throw new Error("meta base64");
      }
      const metaPlain = aesEcbDecrypt(META_KEY, bin);
      const text = new TextDecoder().decode(metaPlain);
      const colon = text.indexOf(":");
      const jsonText = colon >= 0 ? text.slice(colon + 1) : text;
      try {
        meta = JSON.parse(jsonText);
      } catch (e) {
        meta = { raw: text };
      }
    }

    if (off + 4 > bytes.length) throw new Error("truncated after meta");
    off += 4;
    const keyBox = buildKeyBox(rc4Key);
    const located = locateAudio(bytes, off, keyBox);
    off = located.audioOff;
    let cover = located.cover;

    const encrypted = bytes.subarray(off);
    const audio = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      audio[i] = encrypted[i] ^ keyBox[(i + 1) & 0xff];
    }

    if (!isAudioMagic(audio)) {
      throw new Error("decrypted payload is not a recognized audio stream");
    }

    const ext = detectExt(audio, meta && meta.format);
    let payload = audio;
    if (writeMeta && ext === "mp3" && !looksTagged(audio) && (meta.musicName || cover)) {
      const tag = buildId3(meta, cover);
      payload = new Uint8Array(tag.length + audio.length);
      payload.set(tag, 0);
      payload.set(audio, tag.length);
    }

    const base = (fileName || "track").replace(/\.ncm$/i, "");
    const safeName = sanitizeName(meta.musicName ? artistPrefix(meta) + meta.musicName : base);
    return {
      meta,
      cover,
      ext,
      audio: payload,
      fileName: safeName + "." + ext,
      sourceName: fileName || "",
      bytesIn: bytes.length,
      bytesOut: payload.length
    };
  }

  function artistPrefix(meta) {
    if (!meta.artist) return "";
    if (Array.isArray(meta.artist)) {
      const n = meta.artist.map((a) => (Array.isArray(a) ? a[0] : a)).filter(Boolean)[0];
      return n ? n + " - " : "";
    }
    return String(meta.artist) + " - ";
  }

  function sanitizeName(name) {
    return String(name || "track").replace(/[\\/:*?"<>|]/g, "_").trim() || "track";
  }

  function writeWav(pcm, sampleRate, channels) {
    const samples = pcm.length;
    const block = channels * 2;
    const dataSize = samples * 2;
    const buf = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buf);
    const u8 = new Uint8Array(buf);
    function four(o, s) { for (let i = 0; i < 4; i++) u8[o + i] = s.charCodeAt(i); }
    four(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    four(8, "WAVE");
    four(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * block, true);
    view.setUint16(32, block, true);
    view.setUint16(34, 16, true);
    four(36, "data");
    view.setUint32(40, dataSize, true);
    let o = 44;
    for (let i = 0; i < samples; i++) {
      let s = pcm[i];
      if (s > 1) s = 1;
      if (s < -1) s = -1;
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      o += 2;
    }
    return u8;
  }

  root.NcmDump = { dumpBuffer, detectExt, sanitizeName, isAudioMagic, writeWav };
})(typeof window !== "undefined" ? window : globalThis);
