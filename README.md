# NCM Studio

**Packed via Axiox Media**

A local, browser-only wizard that decrypts NetEase Cloud Music `.ncm` containers and writes the original MP3 or FLAC payload.

[中文说明](README.zh.md)

## What it does

1. Select many `.ncm` files, or grant one folder and scan every `.ncm` inside it.
2. Choose whether to write ID3 tags and whether to delete source files after a successful dump.
3. Convert on the current machine. Nothing is uploaded.
4. Remember language, checkboxes, source mode, and the granted folder handle for the next visit.

NCM is a container. The tool does not recode audio. A file that stores FLAC stays FLAC; a file that stores MP3 stays MP3.

## How to open

Directory grants and in-place delete require a secure context (Chrome or Edge on `http://127.0.0.1` or HTTPS). Double-clicking `index.html` only supports the multi-file picker and browser downloads.

```bash
# macOS / Linux
./start.sh

# Windows
start.bat
```

Then open the printed address. Default port is 8765.

## Memory

| Item | Storage |
| --- | --- |
| UI language | `localStorage.aio.uiLang` |
| Source mode, folder name, checkboxes | `localStorage.ncm.studio.prefs` |
| Folder handle | IndexedDB `ncm-studio` |

Delete-after-convert stays **off** unless you turn it on. File-picker mode cannot delete originals.

## Version

v1.0.0
