
import { navbarStyles } from '../assets/dummyStyles'
import img1 from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { ChevronDown,LogOut,User } from 'lucide-react';

import axios from 'axios';

const BASE_URL = "http://localhost:3000"

const Navbar = ({ user: propUser, onLogout }) => {

    const navigate = useNavigate();

    const menuRef = useRef();
    const [menuopen, setMenuopen] = useState(false);

    const user = propUser || {
        name: "",
        email: "",
    };
    
    useEffect(()=>{
        const fetchuserData = async ()=>{
            try{
                const token = localStorage.getItem("token");

                if(!token) return;

                const response = await axios.get(`${BASE_URL}/auth/me`,{
                    headers : {Authorization: `Bearer ${token}`},
                });

                const userData = response.data.user || response.data;

                user(userData);
            }
            catch(error){
                console.error("Couldn't get user:",error);
            }
        }
        if(!propUser){
            fetchuserData();
        }
    },[propUser]);

    const toggleMenu = () => setMenuopen((prev) => !prev);

    const handleLogout = () => {
        setMenuopen(false);
        localStorage.removeItem("token");
        onLogout?.();
        navigate("/login");
    };

    useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuopen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>
                {/* {logo} */}
                <div onClick={() => navigate("/")}
                    className={navbarStyles.logoContainer}
                >
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="logo" />
                    </div>

                    <span className={navbarStyles.logoText}>Expense Tracker</span>
                </div>
                {/* if user present  */}

                {user && (
                    <div className={navbarStyles.userContainer} ref={menuRef}>
                        <button onClick={toggleMenu} className={navbarStyles.userButton}>
                            <div className='relative'>
                                <div className={navbarStyles.userAvatar}>
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className={navbarStyles.statusIndicator}>

                                </div>
                            </div>
                            <div className={navbarStyles.userTextContainer}>
                                <p className={navbarStyles.userName}>{user?.name || "user"}</p>
                                <p className={navbarStyles.userEmail}>{user?.email || "user@example.com"} </p>
                            </div>

                            <ChevronDown className={navbarStyles.chevronIcon(menuopen)} />
                        </button>

                        {/* dropdown menu */}
                        {menuopen && (
                            <div className={navbarStyles.dropdownMenu}>
                                <div className={navbarStyles.dropdownHeader}>
                                    <div className=" flex items-center gap-3">
                                        <div className={navbarStyles.dropdownAvatar}>
                                            {user?.name?.[0]?.toUpperCase() || "U"}
                                        </div>

                                        <div>

                                            <div className={navbarStyles.dropdownName}>
                                                {user?.name || "User"}
                                            </div>
                                            <div className={navbarStyles.dropdownEmail}>
                                                {user?.email || "user@expensetracker"}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className={navbarStyles.menuItemContainer}>
                                    <button
                                    onClick={() => {
                                        setMenuopen(false);
                                        navigate("/profile");
                                    }} className={navbarStyles.menuItem}>
                                        <User className='w-4 h-4'/>
                                        <span>My Profile</span>
                                    </button>
                                </div>

                                <div className={navbarStyles.menuItemBorder}>
                                    <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                    <LogOut className=" w-4 h-4"/>
                                        <span>LogOut</span>                    
                                    </button>
                                    </div>
                            </div>

                        )}

                    </div>
                )}

            </div>

        </header >
    )
}

export default Navbar