import { useState, useEffect } from 'react';

export default function Settings({ isOpen, onClose, onSettingsUpdate }) {
    const [settings, setSettings] = useState({
        barkKey: '',
        notificationThreshold: 3,
        autoRefresh: true,
        refreshInterval: 3,
        enableBarkNotification: true,
        notificationLevel: 1 // 1: 普通通知, 2: 单次响铃, 3: 持续响铃
    });

    // 添加动画状态
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // 先设置可见，但保持初始动画状态
            setIsVisible(true);
            // 使用 setTimeout 确保 DOM 已更新
            setTimeout(() => {
                setIsAnimating(true);
            }, 50);
        } else {
            // 先执行关闭动画
            setIsAnimating(false);
            // 动画结束后再隐藏
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('poolMonitorSettings') || '{}');
        setSettings(prev => ({
            ...prev,
            ...savedSettings
        }));
    }, []);

    const handleSave = () => {
        localStorage.setItem('poolMonitorSettings', JSON.stringify(settings));
        onSettingsUpdate(settings);
        onClose();
    };

    // 处理点击背景关闭
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 ease-out ${isAnimating
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                {/* 标题栏 - 固定在顶部 */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">设置</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 内容区域 - 可滚动 */}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* 自动刷新设置 */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">自动刷新</h3>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            启用自动刷新
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.autoRefresh}
                                                onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        开启后会自动刷新池子信息
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        刷新间隔（秒）
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={settings.refreshInterval}
                                        onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        设置自动刷新的时间间隔，最小 1 秒
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 通知设置 */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">通知设置</h3>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            启用 Bark 通知
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.enableBarkNotification}
                                                onChange={(e) => setSettings(prev => ({ ...prev, enableBarkNotification: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        开启后才会发送池子超区间提醒通知
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Bark Key
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.barkKey}
                                        onChange={(e) => setSettings(prev => ({ ...prev, barkKey: e.target.value }))}
                                        placeholder="输入 Bark Key"
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        用于发送通知，在 Bark App 中获取
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        通知等级
                                    </label>
                                    <select
                                        value={settings.notificationLevel}
                                        onChange={(e) => setSettings(prev => ({ ...prev, notificationLevel: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    >
                                        <option value={1}>1级 - 普通通知</option>
                                        <option value={2}>2级 - 单次响铃</option>
                                        <option value={3}>3级 - 持续响铃</option>
                                    </select>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        选择通知的提醒方式
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        通知阈值
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={settings.notificationThreshold}
                                        onChange={(e) => setSettings(prev => ({ ...prev, notificationThreshold: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        价格连续超出区间多少次后发送通知
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部按钮 - 固定在底部 */}
                <div className="p-6 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 