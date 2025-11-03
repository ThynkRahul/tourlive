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
  const [isScrolled, setIsScrolled] = useState(false);  // scroll UP trigger

  const { navigation } = getLandingTranslations(locale);

  // prefix rule confirmed
  const prefix = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActivePage(currentPath);
  }, []);

  // detect scroll UP → show
  const handleScrollUpCheck = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop < lastScrollTop && scrollTop > 130) {
      setIsScrolled(true);  // Scroll UP show
    } else if (scrollTop < 130) {
      setIsScrolled(false); // initial transparent state again
    }

    setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollUpCheck);
    return () => window.removeEventListener("scroll", handleScrollUpCheck);
  }, [lastScrollTop]);

  const navLinks = [
    { href: `${prefix}/`, label: navigation.links.home },
    { href: `${prefix}/about`, label: navigation.links.aboutUs },
    { href: `${prefix}/testimonials`, label: navigation.links.testimonials },
    { href: `${prefix}/packages`, label: navigation.links.packages },
    { href: `${prefix}/gallery`, label: navigation.links.gallery },
    { href: `${prefix}/blog`, label: navigation.links.blog },
  ];

  const handleLinkClick = (href: string) => {
    setActivePage(href);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleContactClick = () => setActivePage("");

  return (
    <div className="fixed top-0 left-0 w-full z-50">

      {/* PREHEADER always present but HIDDEN at initial */}
      <div className={`${isScrolled ? "block" : "hidden"} sm:block`}>
        {/* keep your preheader block EXACT same */}
      </div>

      {/* NAV BAR */}
      <div
        className={`flex items-center w-full font-urbanist h-[78px] ${
          isScrolled ? "bg-white border-b border-gray-300" : "bg-transparent"
        } transition-all duration-300 text-neutral`}
        style={{ display: displayStyle }}
      >
        <div
          className="navbar flex py-[15px] items-center justify-between"
          style={{ maxWidth: "1270px", margin: "0 auto" }}
        >

          <div className="navbar-start px-4 flex items-center" style={{ marginTop: "-10px" }}>
            <Link href={prefix || "/"} legacyBehavior>
              <a onClick={() => handleLinkClick(prefix || "/")}>
                <Image src={logo} width={128} height={48} alt="Logo" />
              </a>
            </Link>
          </div>

         {/* Mobile hamburger */}
          <div className="md:hidden flex items-center pr-3 relative z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#025C7A]">
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`} />
            </button>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile Sidebar */}
          <div
            className={`md:hidden fixed top-0 right-0 w-3/4 bg-white h-screen z-40 shadow-lg transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col absolute top-0 text-left items-start px-4 gap-4 py-16">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.href} passHref>
                  <button onClick={() => handleLinkClick(link.href)} className={`btn btn-ghost btn-sm rounded-btn ${activePage === link.href ? "text-[#6E9753] text-[16px]" : "text-[#025C7A] text-[16px]"}`}>
                    {link.label}
                  </button>
                </Link>
              ))}

              <Link href={`${prefix}/contact`} passHref>
                <button className={`btn btn-ghost btn-sm text-[16px] rounded-btn ${activePage === `${prefix}/contact` ? "text-[#6E9753]" : "text-[#025C7A]"}`} onClick={() => handleLinkClick(`${prefix}/contact`)}>
                  {navigation.links.contactUs}
                </button>
              </Link>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <LanguageSelector currentLocale={locale} className="w-full" />
              </div>
            </div>
          </div>

          {/* Contact Us Button (Desktop) */}
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
