import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo.svg"
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X } from "react-feather";

export const Navbar: React.FC = () => {
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  return (
    <nav className={(expandMenu ? styles.navbar +" "+ styles.navbarExpanded: styles.navbar)}>
       <div className={styles.logoWrapper}>
      <Image src={logo} 
        className={styles.logo} 
        layout="intrinsic" 
        width={160} 
        height={80}
        alt="Konduit. logo" 
        priority/>
        <div className={styles.expandBtn} onClick={() => setExpandMenu(!expandMenu)}>
          {expandMenu ?
            <X width={36} color={"white"} /> :
            <Menu width={36} color={"white"} />
          }
          </div>   
        </div>   
      <ul>
        <li onClick={() => setExpandMenu(false)}><Link href="/organizations" passHref>Anbefalte organisasjoner</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/method" passHref>Metode</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/about" passHref>Om oss</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/FAQ" passHref>FAQ</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/profile" passHref>Min side</Link></li>
      </ul>
    </nav>
  )
}