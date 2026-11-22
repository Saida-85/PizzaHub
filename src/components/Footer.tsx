import Link from "next/link";
import { Pizza, MapPin, Phone, Mail, Clock } from "lucide-react";

// Brand icons are inline SVGs so we get the NEW X logo (not the old bird).
function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com", Icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "GitHub", href: "https://github.com/Saida-85", Icon: GithubLogo },
];

const MENU_LINKS = [
  { label: "All Pizzas", href: "/menu" },
  { label: "Classic Pizzas", href: "/menu?category=classic" },
  { label: "Vegetarian Pizzas", href: "/menu?category=vegetarian" },
  { label: "Meat Lovers", href: "/menu?category=meat-lovers" },
  { label: "Sides & Appetizers", href: "/menu?category=sides" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/signin" },
  { label: "Create Account", href: "/signup" },
  { label: "Partner as a Kitchen", href: "/signup" },
];

const linkClass = "text-slate-400 hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070C0E] border-t border-[#D4A359]/20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* COLUMN 1: Brand + description + socials */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-md border border-[#D4A359]/70 bg-[#132024] flex items-center justify-center group-hover:border-[#E05A2B] transition-colors">
                <Pizza className="w-5 h-5 text-[#E05A2B] -rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-[0.18em] text-white uppercase leading-none">
                  Pizza<span className="text-[#D4A359]">Hub</span>
                </span>
                <span className="text-[9px] tracking-[0.28em] text-[#94A3B8] uppercase mt-1">
                  Wood-Fired Kitchen
                </span>
              </div>
            </Link>

            <p className="mt-5 text-sm text-slate-400 leading-relaxed">
              Discover local pizzerias, browse fresh menus, and order hot pizza,
              sides and drinks delivered straight to your door.
            </p>

            <ul
              className="mt-6 flex items-center gap-3"
              aria-label="Social media"
            >
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center border border-[#D4A359]/30 text-slate-300 transition-colors hover:border-[#E05A2B] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: Explore Menu */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Explore Menu
            </h3>
            <ul className="space-y-3 text-sm">
              {MENU_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Contact
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E05A2B] shrink-0 mt-0.5" />
                <span>742 Hearthstone Ave, Culinary District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E05A2B] shrink-0" />
                <a
                  href="tel:+15552348910"
                  className="hover:text-white transition-colors"
                >
                  +1 (555) 234-8910
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E05A2B] shrink-0" />
                <a
                  href="mailto:orders@pizzahub.local"
                  className="hover:text-white transition-colors"
                >
                  orders@pizzahub.local
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A359] shrink-0" />
                <span>Daily: 11:00 AM – 11:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-[#D4A359]/15 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} PizzaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
