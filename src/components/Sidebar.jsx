import { Link } from "react-router-dom";
import "../.css";

function Sidebar() {
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