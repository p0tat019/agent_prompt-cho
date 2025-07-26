import React, { useState } from 'react';

interface PasswordScreenProps {
    onPasswordSubmit: (password: string) => void;
    error: string | null;
    isLoading: boolean;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onPasswordSubmit, error, isLoading }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPasswordSubmit(password);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto">
                <header className="text-center mb-8">
                     <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        에이전트 프롬프트 최적화 도구
                    </h1>
                    <p className="mt-2 text-lg text-slate-400">
                        접근하려면 비밀번호를 입력하세요.
                    </p>
                </header>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 text-slate-200 placeholder-slate-500"
                            placeholder="비밀번호"
                            aria-describedby="password-error"
                        />
                    </div>
                    {error && (
                        <div id="password-error" className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" role="status" aria-label="loading"></div>
                                    <span>확인 중...</span>
                                </>
                            ) : (
                                '입장'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordScreen;
