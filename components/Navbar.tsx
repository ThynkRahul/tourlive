"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/logo.png";
import LanguageSelector from "./LanguageSelector";
import { getLandingTranslations } from "../lib/translationHelper";

const NavBar: React.FC<{ locale: string }> = ({ locale }) => {
  const [displayStyle, setDisplayStyle] = useState<"block" | "none">("block");
  const [activePage, setActivePage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const { navigation } = getLandingTranslations(locale);

  // prefix auto calc (THIS IS MAIN FIX)
  const prefix = locale === "en" ? "" : `/${locale}`;

  const navLinks = [
    { href: `${prefix}/`, label: navigation.links.home },
    { href: `${prefix}/about`, label: navigation.links.aboutUs },
    { href: `${prefix}/testimonials`, label: navigation.links.testimonials },
    { href: `${prefix}/packages`, label: navigation.links.packages },
    { href: `${prefix}/gallery`, label: navigation.links.gallery },
    { href: `${prefix}/blog`, label: navigation.links.blog },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 130);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActivePage(currentPath);
  }, []);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 130) setDisplayStyle("none");
    else setDisplayStyle("block");
    setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleLinkClick = (href: string) => {
    setActivePage(href);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleContactClick = () => setActivePage("");

  return (
    <div className="fixed top-0 left-0 w-full z-50">

      {/* PREHEADER OMITTED - unchanged code ABOVE here stays same */}

      {/* Navbar */}
      <div className={`flex items-center w-full font-urbanist h-[78px] bg-white text-neutral transition-all duration-300 border-b border-gray-300`} style={{ display: displayStyle }}>
        <div className="navbar flex py-[15px] items-center justify-between" style={{ maxWidth: "1270px", margin: "0 auto" }}>

          {/* Logo */}
          <div className="navbar-start px-4 flex items-center" style={{ marginTop: "-10px" }}>
            <Link href={prefix || "/"} legacyBehavior>
              <a onClick={() => handleLinkClick(prefix || "/")}>
                <Image src={logo} width={128} height={48} alt="Logo" />
              </a>
            </Link>
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center pr-3 relative z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#025C7A]">
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`} />
            </button>
          </div>

          {/* Desktop */}
          <div className="navbar-center md:flex flex-grow hidden">
            <div className="flex items-center justify-center gap-2">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.href} passHref>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className={`btn btn-ghost btn-sm rounded-btn ${activePage === link.href ? "text-[#6E9753] text-[16px]" : "text-[#025C7A] text-[16px]"}`}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Desktop */}
          <div className="navbar-end md:flex px-4 hidden">
            <Link href={`${prefix}/contact`} passHref>
              <button onClick={handleContactClick} className="btn flex items-center justify-center min-w-[173px] h-[46px] rounded-[41px] bg-[#025C7A] pr-[6px] pl-[10px] hover:bg-[#6E9753]">
                <span className="mr-2 text-white uppercase font-bold text-[16px]">{navigation.links.contactUs}</span>
                <span className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white">
                  <i className="fas fa-arrow-right text-[#025C7A] text-lg " />
                </span>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NavBar;
