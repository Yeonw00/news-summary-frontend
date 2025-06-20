import { Link } from "react-router-dom";
import "../.css";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { setIsLoggedIn } = useAuth();

    const handleLogout = () =>  {
        setIsLoggedIn(false);
    };

    return(
        <div className="sidebar">
            <nav>
                <ul>
                    <li><Link to="/summary">새 요약</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;