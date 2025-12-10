# 活動座位查詢系統

一個簡單易用的活動座位查詢系統，適用於婚禮、晚宴、會議等需要座位安排的場合。

## 功能特色

- 🔍 **快速查詢**: 輸入姓名即可查詢座位
- 📱 **響應式設計**: 支援手機、平板、電腦等各種裝置
- 🔄 **動態資料載入**: 支援從本地或 GitHub 載入資料
- ⚙️ **管理介面**: 提供後台管理功能，可快速匯入資料
- 🎨 **美觀介面**: 使用 Tailwind CSS 打造現代化 UI

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發環境

```bash
npm run dev
```

預設會在 http://localhost:3000 啟動開發伺服器

### 建置生產版本

```bash
npm run build
```

建置完成的檔案會在 `dist` 目錄

### 預覽生產版本

```bash
npm run preview
```

## 資料來源設定

系統直接從 GitHub repository 的 `config.json` 載入資料。

### config.json 格式

將 `config.json` 放在專案根目錄，格式如下:

```json
[
    {
        "name": "王大明",
        "table": "1",
        "note": "主桌"
    },
    {
        "name": "陳小惠",
        "table": "3"
    }
]
```

### 更新資料流程

1. 在 GitHub 上直接編輯 `config.json`
2. Commit 並 Push 更新
3. 使用者在管理介面點擊「重新載入」按鈕，或重新整理頁面

**優點:**
- ✅ 無需重新部署即可更新資料
- ✅ 直接在 GitHub 上編輯 config.json
- ✅ 即時生效

## 資料格式

每筆資料需包含以下欄位:

- `name` (必填): 姓名
- `table` (必填): 桌號
- `note` (選填): 備註 (例如: 素食、親友等)

## 管理介面

點擊右上角的設定圖示即可進入管理介面:

- 📋 **資料匯入**: 支援從 Excel 複製貼上
- 🔄 **重新載入**: 手動重新載入遠端資料
- 👁️ **資料預覽**: 查看目前載入的所有資料

## 技術棧

- React 18
- Vite 6
- Tailwind CSS 3
- Lucide React (圖示)

## 部署

### GitHub Pages

1. 更新 `vite.config.js` 加入 base path:

```js
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ...
})
```

2. 建置並部署:

```bash
npm run build
# 將 dist 目錄內容部署到 GitHub Pages
```

### Vercel / Netlify

直接連接 GitHub repository，系統會自動部署。

## License

MIT

---

**© 2024 Event Seat Finder. 祝活動圓滿成功！**
