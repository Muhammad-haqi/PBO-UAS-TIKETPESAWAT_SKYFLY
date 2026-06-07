import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PesanPage from "./pages/PesanPage";
import RiwayatPage from "./pages/RiwayatPage";
import About from "./pages/About";
import Bantuan from "./pages/Bantuan";
import Refund from "./components/Refund";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  // 1. Mengubah pembacaan state agar menggunakan userInfo dari sistem baru kita
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("userInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [theme, setTheme] = useState(document.body.classList.contains("dark") ? "dark" : "light");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  // 2. Fungsi login diperbarui untuk menerima object data user
  function handleLogin(userData) {
    setUser(userData);
  }

  // 3. Fungsi logout membersihkan token dan data dengan bersih
  function handleLogout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("loggedUser"); // Bersihkan sisa data lama jika ada
    setUser(null);
    navigate("/login");
  }

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }

  // Mengecek apakah kita sedang di halaman admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* 4. Navbar disembunyikan jika berada di halaman Admin (biar admin fokus ke Dashboard) */}
      {user && !isAdminRoute && (
        <Navbar 
          onNav={(p) => navigate(p)} 
          onLogout={handleLogout} 
          onToggleTheme={toggleTheme} 
          theme={theme} 
          // Mengambil nama dari object userInfo, fallback ke string jika format lama
          username={user.nama_lengkap || user.namaPemesan || user} 
        />
      )}

      {/* 5. Mengatur padding atas agar halaman admin (yang tidak pakai navbar) tidak terlalu turun */}
      <main className={!isAdminRoute ? "pt-20" : ""}>
        <Routes>
          {/* Rute Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Rute Publik & Penumpang */}
          <Route path="/refund" element={<Refund />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          
          {/* Rute Terlindungi (Protected) */}
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/pesan" element={user ? <PesanPage /> : <Navigate to="/login" replace />} />
          <Route path="/riwayat" element={user ? <RiwayatPage /> : <Navigate to="/login" replace />} />
          
          {/* fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-10 p-6 text-gray-800 dark:text-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Hubungi Kami</div>
            <div>
              Telepon: <a href="tel:081234567890" className="text-blue-600 dark:text-blue-500 hover:underline">0812-3456-7890</a>
            </div>
            <div>
              Email: <a href="mailto:info@skyflypro.com" className="text-blue-600 dark:text-blue-500 hover:underline">info@skyflypro.com</a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Media Sosial</div>
            <div className="flex gap-3 text-sm">
              <a href="https://www.instagram.com/haqirsyarzy_/?__pwa=1#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 dark:hover:text-pink-400">Instagram</a>
              <a href="https://facebook.com/skyflypro" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 dark:hover:text-blue-400">Facebook</a>
              <a href="https://twitter.com/skyflypro" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 dark:hover:text-blue-300">Twitter</a>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">&copy; 2025 SkyFly Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </>
  );
}