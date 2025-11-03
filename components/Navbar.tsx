"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/logo.png";
import LanguageSelector from "./LanguageSelector";
import { getLandingTranslations } from "../lib/translationHelper";

const SCROLL_THRESHOLD = 130;

const NavBar: React.FC<{ locale: string }> = ({ locale }) => {
  // controls whether navbar is rendered ("block") or hidden ("none")
  const [displayStyle, setDisplayStyle] = useState<"block" | "none">("block");

  // active path for highlighting
  const [activePage, setActivePage] = useState("");

  // mobile menu open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // preheader (black top bar) visibility
  const [isPreheaderVisible, setIsPreheaderVisible] = useState(false);

  // navbar background mode: "transparent" or "white"
  // PER YOUR LAST MESSAGE: initial = transparent FOR ALL LOCALES
  const [navbarMode, setNavbarMode] = useState<"transparent" | "white">("transparent");

  // track last scroll top in ref to avoid stale closure problems
  const lastScrollTopRef = useRef<number>(0);

  const { navigation } = getLandingTranslations(locale);

  // prefix logic: english = no prefix (root), others keep /{lang}
  const prefix = locale === "en" ? "" : `/${locale}`;

  const navLinks = [
    { href: `${prefix}/`, label: navigation.links.home },
    { href: `${prefix}/about`, label: navigation.links.aboutUs },
    { href: `${prefix}/testimonials`, label: navigation.links.testimonials },
    { href: `${prefix}/packages`, label: navigation.links.packages },
    { href: `${prefix}/gallery`, label: navigation.links.gallery },
    { href: `${prefix}/blog`, label: navigation.links.blog },
  ];

  // set initial active path and baseline scroll on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePage(window.location.pathname);
      lastScrollTopRef.current = window.pageYOffset || document.documentElement.scrollTop;
      setDisplayStyle("block"); // ensure navbar element is visible (may be transparent)
      setIsPreheaderVisible(false); // preheader hidden initially
      setNavbarMode("transparent"); // initial transparent for all locales per your last instruction
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unified scroll handler controlling navbar visibility, navbar background, and preheader
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const lastScrollTop = lastScrollTopRef.current;

    // Scrolling down AND beyond threshold -> hide navbar (both nav + preheader hidden while scrolling down)
    if (scrollTop > lastScrollTop && scrollTop > SCROLL_THRESHOLD) {
      setDisplayStyle("none");
      setIsPreheaderVisible(false);
      // do NOT change navbarMode here — it will become white on next show (scroll up)
    } else {
      // Scrolling up OR not past threshold -> show navbar
      setDisplayStyle("block");

      // When showing on scroll-up, navbar becomes white
      setNavbarMode("white");

      // If still beyond threshold, show preheader; else hide it
      if (scrollTop > SCROLL_THRESHOLD) {
        setIsPreheaderVisible(true);
      } else {
        setIsPreheaderVisible(false);
        // If near top (<= threshold) and user is at top, revert navbar to transparent
        if (scrollTop <= SCROLL_THRESHOLD) {
          setNavbarMode("transparent");
        }
      }
    }

    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  // Attach unified scroll listener for mobile + desktop
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // lastScrollTopRef intentionally not in deps
  }, []);

  const handleLinkClick = (href: string) => {
    setActivePage(href);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    setActivePage("");
  };

  // navbar background classes based on mode
  const navbarBgClass = navbarMode === "transparent" ? "bg-transparent border-none" : "bg-white border-b border-gray-300";

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* PRE-HEADER (black top bar) - visible only when isPreheaderVisible is true */}
      <div className={`${isPreheaderVisible ? "block" : "hidden"} sm:block`}>
        <div
          className={`bg-black text-white h-[57px] py-[14px] px-[65px] font-urbanist md:flex justify-center transition-all duration-300`}
          style={{ display: displayStyle }}
        >
          <div className="flex justify-center sm:justify-between items-center text-xs md:text-sm w-full max-w-[1270px] mx-auto">
            {/* Contact Details */}
            <div className="hidden sm:block">
              <div className="flex gap-4">
                <span className="flex items-center gap-2">
                  <span className="relative flex items-center justify-center rounded-full bg-transparent text-white">
                    <i className="fas fa-phone fa-flip-horizontal text-[15px]" />
                  </span>
                  <a href="tel:+919873186168" className="text-white text-[16px]">
                    +91 987 318 6168
                  </a>
                </span>

                <span className="flex items-center gap-2">
                  <i className="fas fa-envelope text-[18px]" />
                  <span className="flex flex-wrap">
                    <a href="mailto:info@eazetours.com" className="text-white text-[16px]">
                      info@eazetours.com
                    </a>
                    ,
                    <a href="mailto:harshit@eazetours.com" className="text-white text-[16px] ml-1">
                      harshit@eazetours.com
                    </a>
                  </span>
                </span>
              </div>
            </div>

            {/* Social Icons and Language Selector */}
            <div className="flex gap-2 items-center">
              <a
                href="https://www.tripadvisor.in/Attraction_Review-g304551-d17734269-Reviews-EAZE_TOURS-New_Delhi_National_Capital_Territory_of_Delhi.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-300"
              >
                <i className="fab fa-tripadvisor text-sm leading-lg" />
              </a>

              <a
                href="https://www.instagram.com/eazetourpackages/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-300"
              >
                <i className="fab fa-instagram text-sm leading-lg" />
              </a>

              <a
                href="https://www.facebook.com/eazetour/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-300"
              >
                <i className="fab fa-facebook text-sm leading-lg" />
              </a>

              <a
                href="https://www.pinterest.com/eazetourpackages/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-7 h-7 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-300"
              >
                <i className="fab fa-pinterest text-sm leading-lg" />
              </a>

              <div className="ml-4">
                <LanguageSelector currentLocale={locale} variant="pre-header" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR (white or transparent depending on navbarMode) */}
      <div
        className={`flex items-center w-full font-urbanist h-[78px] transition-all duration-300 ${navbarBgClass}`}
        style={{ display: displayStyle }}
      >
        <div className="navbar flex py-[15px] items-center justify-between" style={{ maxWidth: "1270px", margin: "0 auto" }}>
          {/* Logo */}
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
