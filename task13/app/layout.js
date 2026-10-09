import Link from 'next/link';
import './globals.css';

export const metadata = {
    title: 'Zen-Money — Учёт финансов',
    description: 'Приложение для учёта доходов и расходов на Next.js'
};

const FLOATING_EMOJIS = ['💰', '💸', '💎', '🪙', '💵', '💳', '💴', '💶', '🏦', '📈', '💹', '🤑', '💼', '🎯', '✨'];

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <body>
                {FLOATING_EMOJIS.map((emoji, i) => (
                    <span key={i} className="floating-emoji">{emoji}</span>
                ))}
                <div className="app">
                    <header className="header">
                        <h1>💰 Zen-Money</h1>
                        <nav className="nav">
                            <Link href="/">Список</Link>
                            <Link href="/add">Добавить</Link>
                            <Link href="/stats">Сводка</Link>
                        </nav>
                    </header>
                    <main className="main">{children}</main>
                </div>
            </body>
        </html>
    );
}