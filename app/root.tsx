import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import {
  NextUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";

import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { useState } from "react";

export const links: LinksFunction = () => [];

export const menuItems = [
  { title: "Tag List", href: "/" },
  { title: "Add Tag", href: "/add_tag" },
  { title: "Browse Catalog", href: "/browse" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
              />
              <NavbarBrand>
                <p className="font-bold text-inherit">Spotify Tags</p>
              </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
              {menuItems.map((item) => (
                <NavbarItem
                  key={item.href}
                  isActive={location.pathname === item.href}
                >
                  <Link
                    color={
                      location.pathname === item.href ? "foreground" : "primary"
                    }
                    href={item.href}
                    {...(location.pathname === item.href
                      ? { "aria-current": "page" }
                      : {})}
                  >
                    {item.title}
                  </Link>
                </NavbarItem>
              ))}
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat">
                  Settings
                </Button>
              </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
              {menuItems.map((item) => (
                <NavbarMenuItem key={item.href}>
                  <Link
                    color={
                      location.pathname === item.href ? "foreground" : "primary"
                    }
                    href={item.href}
                    {...(location.pathname === item.href
                      ? { "aria-current": "page" }
                      : {})}
                  >
                    {item.title}
                  </Link>
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
          </Navbar>
          <main>
            <div className="container mx-auto p-4">{children}</div>
          </main>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
