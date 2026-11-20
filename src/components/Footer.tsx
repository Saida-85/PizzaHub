import Link from "next/link";
import { Pizza, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070C0E] border-t border-[#D4A359]/20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* COLUMN 1: Brand Logo (Matches Navbar Logo) */}
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
              Artisanal stone-hearth pizzas, craft beverages, and house-baked
              desserts delivered fresh from verified local pizzerias straight to
              your table.
            </p>
          </div>

          {/* COLUMN 2: Explore Menu */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Explore Menu
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/menu"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  All Wood-Fired Pizzas
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=signature"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Signature Pies
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=drinks"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Chilled Craft Drinks
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=desserts"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sweet Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/vendor"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Partner as a Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Contact & Hours */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A359] mb-5">
              Kitchen &amp; Support
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E05A2B] shrink-0 mt-0.5" />
                <span>742 Hearthstone Ave, Culinary District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E05A2B] shrink-0" />
                <span>+1 (555) 234-8910</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E05A2B] shrink-0" />
                <span>orders@pizzahub.local</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A359] shrink-0" />
                <span>Daily: 11:00 AM – 11:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-[#D4A359]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} PizzaHub Wood-Fired Kitchen. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/menu"
              className="hover:text-[#D4A359] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/menu"
              className="hover:text-[#D4A359] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
