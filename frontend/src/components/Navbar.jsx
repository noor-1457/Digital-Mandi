import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/airlinesPage", label: "Airlines" },
    { path: "/umrah-packages", label: "Umrah Packages" },
    { path: "/hajj", label: "Hajj 2027" },
    { path: "/visa", label: "Visas" },
  ];
   const isActive = (path) => {
    return location.pathname === path;
  };

  return(
    <>
    
    </>
  );

}