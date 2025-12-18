import { Link, Outlet, useLocation } from 'react-router-dom';

function Layout() {
    const location = useLocation();

    const navItems = [
        { path: '/gebco', label: 'GEBCO' },
        { path: '/etopo', label: 'ETOPO' },
        { path: '/layers', label: '레이어 관리' }  // 추가
    ];

    return (
        <div className="h-screen flex flex-col">
            <header className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-300 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Ocean Map</h1>
                <nav className="flex gap-2">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                px-4 py-2 rounded-md text-sm font-medium transition-all
                                ${location.pathname === item.path
                                ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
