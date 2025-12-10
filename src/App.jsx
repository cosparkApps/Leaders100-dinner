import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Users, Settings, Save, CheckCircle, AlertCircle, X } from 'lucide-react';

const App = () => {
    // 頁面狀態: 'search' (查詢) 或 'admin' (管理)
    const [view, setView] = useState('search');

    // 預設資料
    const defaultData = [
        { name: "王大明", table: "1", note: "主桌" },
        { name: "陳小惠", table: "3", note: "女方親友" },
        { name: "李志豪", table: "5", note: "大學同學" },
        { name: "林雅婷", table: "5", note: "大學同學" },
        { name: "張建國", table: "10", note: "公司同事" },
        { name: "0912345678", table: "10", note: "公司同事(電話搜尋範例)" }
    ];

    // 狀態管理
    const [participants, setParticipants] = useState(defaultData);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // 管理介面狀態
    const [rawInput, setRawInput] = useState('');
    const [importStatus, setImportStatus] = useState({ type: '', msg: '' });

    // 搜尋邏輯
    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const found = participants.find(p =>
            p.name.includes(query.trim()) ||
            (p.phone && p.phone.includes(query.trim()))
        );

        setResult(found || null);
        setHasSearched(true);
    };

    // 重置搜尋
    const clearSearch = () => {
        setQuery('');
        setResult(null);
        setHasSearched(false);
    };

    // 處理資料匯入 (解析 Excel 複製的文字)
    const handleImport = () => {
        if (!rawInput.trim()) {
            setImportStatus({ type: 'error', msg: '請輸入資料' });
            return;
        }

        try {
            // 支援 Tab 分隔 (Excel) 或 逗號分隔 (CSV)
            const lines = rawInput.split('\n');
            const newData = lines.map(line => {
                // 移除多餘空白
                const cleanLine = line.trim();
                if (!cleanLine) return null;

                // 嘗試用 tab 分割，如果沒有 tab 則嘗試用逗號
                let parts = cleanLine.split('\t');
                if (parts.length < 2) parts = cleanLine.split(/[,，]/); // 支援全形或半形逗號

                if (parts.length >= 2) {
                    return {
                        name: parts[0].trim(),
                        table: parts[1].trim(),
                        note: parts[2] ? parts[2].trim() : ''
                    };
                }
                return null;
            }).filter(item => item !== null);

            if (newData.length > 0) {
                setParticipants(newData);
                setImportStatus({ type: 'success', msg: `成功匯入 ${newData.length} 筆資料！` });
                setTimeout(() => setView('search'), 1500);
            } else {
                setImportStatus({ type: 'error', msg: '格式無法辨識，請確保每行有「姓名」和「桌號」' });
            }
        } catch (err) {
            setImportStatus({ type: 'error', msg: '處理資料時發生錯誤' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 font-sans text-slate-800">

            {/* 頂部導航 */}
            <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
                    <MapPin className="w-6 h-6" />
                    <span>活動座位查詢</span>
                </div>
                <button
                    onClick={() => setView(view === 'search' ? 'admin' : 'search')}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    title={view === 'search' ? "進入資料管理" : "返回查詢"}
                >
                    {view === 'search' ? <Settings className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
            </nav>

            <main className="max-w-md mx-auto p-4 pt-8">

                {/* === 查詢介面 === */}
                {view === 'search' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">歡迎蒞臨</h1>
                            <p className="text-slate-500">請輸入您的姓名查詢座位</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="輸入姓名 (例如: 王大明)"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    查詢
                                </button>
                            </form>
                        </div>

                        {/* 查詢結果顯示區域 */}
                        {hasSearched && (
                            <div className="mt-6">
                                {result ? (
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-indigo-100 animate-in zoom-in-95 duration-300">
                                        <div className="bg-indigo-600 p-4 text-center">
                                            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">為您安排的座位在</p>
                                        </div>
                                        <div className="p-8 text-center space-y-4">
                                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                                                <span className="text-4xl font-bold">{result.table}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-800 mb-1">第 {result.table} 桌</h2>
                                                <p className="text-xl text-slate-600">{result.name} 貴賓</p>
                                                {result.note && (
                                                    <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-500 text-sm rounded-full">
                                                        {result.note}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                                            <button
                                                onClick={clearSearch}
                                                className="text-indigo-600 font-medium hover:text-indigo-800"
                                            >
                                                查詢下一位
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-red-100 animate-in shake duration-300">
                                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">查無此人</h3>
                                        <p className="text-slate-500 mb-4">抱歉，找不到 "{query}" 的座位資訊。</p>
                                        <p className="text-sm text-slate-400">請確認姓名是否輸入正確，<br />或直接洽詢現場招待人員。</p>
                                        <button
                                            onClick={() => { setQuery(''); setHasSearched(false); }}
                                            className="mt-4 text-indigo-600 font-medium hover:underline"
                                        >
                                            重新輸入
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* === 後台管理介面 === */}
                {view === 'admin' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <div className="flex items-center space-x-2 mb-4 border-b pb-4">
                                <Settings className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-xl font-bold">資料快速匯入</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                                    <p className="font-bold mb-1">使用說明：</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>請從 Excel 直接複製兩欄：<strong>姓名</strong> 與 <strong>桌號</strong></li>
                                        <li>也可以手動輸入，中間用「空白」或「逗號」隔開</li>
                                        <li>第三欄可選填備註 (例如: 素食、女方親友)</li>
                                    </ul>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        貼上資料區域
                                    </label>
                                    <textarea
                                        value={rawInput}
                                        onChange={(e) => setRawInput(e.target.value)}
                                        placeholder={`範例格式：\n王大明	1	主桌\n李小美	3\n張三	5	大學同學`}
                                        className="w-full h-48 p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {importStatus.msg && (
                                    <div className={`p-3 rounded-lg flex items-center space-x-2 ${importStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        {importStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <span>{importStatus.msg}</span>
                                    </div>
                                )}

                                <div className="flex space-x-3 pt-2">
                                    <button
                                        onClick={handleImport}
                                        className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center space-x-2 transition-colors"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>確認更新資料</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setParticipants(defaultData);
                                            setImportStatus({ type: 'success', msg: '已還原為預設測試資料' });
                                        }}
                                        className="px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        還原預設
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t">
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    目前資料預覽 ({participants.length} 筆)
                                </h3>
                                <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-lg border border-slate-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-500 sticky top-0">
                                            <tr>
                                                <th className="p-2 pl-3">姓名</th>
                                                <th className="p-2">桌號</th>
                                                <th className="p-2">備註</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {participants.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-2 pl-3 font-medium text-slate-700">{p.name}</td>
                                                    <td className="p-2 text-indigo-600 font-bold">{p.table}</td>
                                                    <td className="p-2 text-slate-400 text-xs">{p.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* 頁尾 */}
            <footer className="mt-12 pb-6 text-center text-slate-400 text-sm">
                <p>© 2024 Event Seat Finder. 祝活動圓滿成功！</p>
            </footer>
        </div>
    );
};

export default App;

