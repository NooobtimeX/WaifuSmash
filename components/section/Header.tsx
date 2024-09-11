"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CgProfile } from "react-icons/cg";
import { TbBrandNextjs } from "react-icons/tb";
import { signOutAction } from "@/app/actions"; // Adjust if necessary

const navigation = [
  { name: "HOME", href: "/" },
  { name: "CREATE", href: "/create" },
];

const dropdownItems = [
  { name: "PROFILE", href: "/profile" },
  { name: "SETTING", href: "/profile/setting" },
  { name: "SIGN OUT", href: "#", onClick: () => signOutAction() },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavbarProps {
  user: any; // Type this based on your user structure
}

const Header: React.FC<NavbarProps> = ({ user }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen((prev) => {
      if (!prev) {
        setDropdownOpen(false); // Close the dropdown when opening the mobile menu
      }
      return !prev;
    });
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => {
      if (!prev) {
        setMobileMenuOpen(false); // Close the mobile menu when opening the dropdown
      }
      return !prev;
    });
  };
  return (
    <nav className="sticky top-0 z-40 mb-1 rounded-xl bg-secondary shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={handleMenuToggle}
              className="inline-flex items-center justify-center bg-primary p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                className={`h-6 w-6 ${isMobileMenuOpen ? "hidden" : "block"}`}
              />
              <XMarkIcon
                className={`h-6 w-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
              />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <a href="/">
                <TbBrandNextjs className="text-third text-3xl" />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {user
                  ? // Show navigation when signed in
                    navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          "hover:bg-third text-gray-300 hover:text-primary",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                      >
                        {item.name}
                      </a>
                    ))
                  : navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          "hover:bg-third text-gray-300 hover:text-primary",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center rounded-full bg-gray-800 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <CgProfile className="text-third text-3xl" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-secondary shadow-lg ring-1 ring-black ring-opacity-5">
                    <p className="pt-1 text-center text-white">{user?.email}</p>
                    <div className="py-1">
                      {dropdownItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={item.onClick}
                          className="hover:bg-third block rounded-xl px-4 py-2 text-sm text-white hover:text-primary"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden space-x-4 sm:flex">
                <a href="/SignIn">
                  <button className="bg-third rounded-md px-3 py-2 text-primary">
                    Sign In
                  </button>
                </a>
                <a href="/SignUp">
                  <button className="bg-third rounded-md px-3 py-2 text-primary">
                    Sign Up
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute z-50 w-full rounded-xl bg-secondary p-2 sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {user
              ? navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "block rounded-md px-3 py-2 text-base font-medium",
                      "hover:bg-third text-gray-300 hover:text-primary",
                    )}
                  >
                    {item.name}
                  </a>
                ))
              : navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "block rounded-md px-3 py-2 text-base font-medium",
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                    )}
                  >
                    {item.name}
                  </a>
                ))}
          </div>
          {!user && (
            <div className="flex justify-center space-x-4 px-2">
              <a href="/SignIn">
                <button className="bg-third rounded-md px-3 py-2 text-primary">
                  Sign In
                </button>
              </a>
              <a href="/SignUp">
                <button className="bg-third rounded-md px-3 py-2 text-primary">
                  Sign Up
                </button>
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
