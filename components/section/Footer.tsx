import React from "react";
import { FaTwitter, FaYoutube, FaFacebookF, FaDiscord } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content bottom-0 flex items-center justify-between rounded-xl bg-secondary p-4 shadow-xl">
      <aside className="flex items-center">
        <p>© {new Date().getFullYear()} waifusmash.com</p>
      </aside>
      <nav className="flex gap-4">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={24} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube size={24} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF size={24} />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
