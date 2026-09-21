# NCM Studio

本地、纯前端的步骤式工具：批量解密网易云音乐 `.ncm` 容器，写出其中的 MP3 或 FLAC。

## 功能

1. 批量选择 `.ncm` 文件，或授权一个目录并扫描其中全部 `.ncm`。
2. 可选择写入标题 / 艺术家 / 专辑；可选择在转换成功后删除源目录中的 NCM（默认关闭）。
3. 全程在本机完成，文件不上传。
4. 记忆界面语言、勾选状态、来源方式，以及已授权的目录句柄。

NCM 是加密容器，本工具不做有损转码。源内是 FLAC 即输出 FLAC，源内是 MP3 即输出 MP3。

## 打开方式

目录授权与就地删除需要安全上下文（Chrome / Edge 访问 `http://127.0.0.1` 或 HTTPS）。直接双击 `index.html` 仅支持批量选文件与浏览器下载。

```bash
# macOS / Linux
./start.sh

# Windows
start.bat
```

按终端给出的地址打开。默认端口 8765。

## 记忆

| 项目 | 位置 |
| --- | --- |
| 界面语言 | `localStorage.aio.uiLang` |
| 来源方式、目录名、勾选框 | `localStorage.ncm.studio.prefs` |
| 目录句柄 | IndexedDB `ncm-studio` |

“转换后删除源 NCM”默认关闭。文件选择模式无法删除原件。

## 版本

v1.0.0
