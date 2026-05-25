
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
	LayoutDashboard, 
	Users,
	Activity,
	FileText,
	ClipboardCheck,
	Box,
	ChevronDown,
	Droplets,
	Settings,
	LogOut,
} from "lucide-react";
import { getUsuarioActivo } from "../app/usuarioActivo";

export default function Sidebar() {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const navigate = useNavigate();
	const user = getUsuarioActivo();

	const handleLogout = () => {
		localStorage.removeItem("usuarioActivo");
		navigate("/login-temporal");
	};

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<div className="logo-container">
					<Droplets className="logo-icon" />
				</div>
				<div className="brand-info">
					<h3>ASADA</h3>
					<p>Salitre</p>
				</div>
			</div>

			<div className="sidebar-content">
				<nav className="nav-group">
					<p className="eyebrow">Principal</p>
					<NavLink className="nav-link" to="/">
						<LayoutDashboard className="nav-icon" />
						<span>Dashboard</span>
					</NavLink>
				</nav>

				<nav className="nav-group">
					<p className="eyebrow">Gestión</p>
					
					<NavLink className="nav-link" to="/abonados">
						<Users className="nav-icon" />
						<span>Abonados</span>
						<span className="badge">248</span>
					</NavLink>
					<NavLink className="nav-link" to="/medidores">
						<Activity className="nav-icon" />
						<span>Medidores</span>
					</NavLink>
				</nav>

				<nav className="nav-group">
					<p className="eyebrow">Operativo</p>
					<NavLink className="nav-link" to="/materiales">
						<Box className="nav-icon" />
						<span>Inventario</span>
					</NavLink>
				</nav>

				<nav className="nav-group">
					<p className="eyebrow">Configuración</p>
					<NavLink className="nav-link" to="/personas">
						<Users className="nav-icon" />
						<span>Personas</span>
					</NavLink>
					<NavLink className="nav-link" to="/solicitudes">
						<FileText className="nav-icon" />
						<span>Solicitudes</span>
					</NavLink>
					<NavLink className="nav-link" to="/inspecciones">
						<ClipboardCheck className="nav-icon" />
						<span>Inspecciones</span>
					</NavLink>
				</nav>
			</div>

			<div className="sidebar-footer">
				{showUserMenu && (
					<div className="user-menu">
						<button className="user-menu-item danger" onClick={handleLogout}>
							<LogOut className="user-menu-icon" />
							<span>Cerrar Sesión</span>
						</button>
					</div>
				)}

				<div 
					className="user-profile" 
					onClick={() => setShowUserMenu(!showUserMenu)}
				>
					<div className="user-avatar">
						{user?.nombre_usuario.substring(0, 2).toUpperCase() || "AD"}
					</div>
					<div className="user-info">
						<span className="user-name">{user?.nombre_usuario || "Administrador"}</span>
						<span className="user-email">{"admin@asada.cr"}</span>
					</div>
					<ChevronDown className="user-dropdown-icon" />
				</div>
			</div>
		</aside>
	);
}
