import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Instagram, Facebook, Send, Mail, Phone, MapPin } from "lucide-react";

const defaultProps = {
  siteName: "Hadmate",
  tagline: "Handcrafted with love. Unique handmade gifts for every occasion.",
  copyrightText: `© ${new Date().getFullYear()} Hadmate. All rights reserved.`,
  socialLinks: {},
  contactInfo: {},
};

export default function Footer(props) {
  const { settings } = useSelector((state) => state.settings);

  const { siteName, tagline, copyrightText, socialLinks, contactInfo } = {
    siteName: settings?.siteName || defaultProps.siteName,
    tagline: settings?.tagline || defaultProps.tagline,
    copyrightText:
      settings?.footer?.copyrightText || defaultProps.copyrightText,
    socialLinks: settings?.footer?.socialLinks || defaultProps.socialLinks,
    contactInfo: settings?.contactInfo || defaultProps.contactInfo,
    ...props,
  };

  const quickLinks = [
    { to: "/shop", label: "All Products" },
    { to: "/custom-order", label: "Custom Order" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/faqs", label: "FAQs" },
    { to: "/track-order", label: "Track Order" },
  ];

  const policyLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/shipping-policy", label: "Shipping Policy" },
    { to: "/return-policy", label: "Return & Refund" },
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white tracking-tight">
              {siteName}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400 max-w-xs">
              {tagline}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-neutral-800 p-2.5 text-neutral-400 transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-neutral-800 p-2.5 text-neutral-400 transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.pinterest && (
                <a
                  href={socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-neutral-800 p-2.5 text-neutral-400 transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Pinterest"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Policies
            </h4>
            <ul className="mt-4 space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3">
              {contactInfo?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-primary"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-primary"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-neutral-400">
                    {contactInfo.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-800 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-500">{copyrightText}</p>
          <p className="text-sm text-neutral-500">
            {tagline || "Handcrafted with ❤️"}
          </p>
        </div>
      </div>
    </footer>
  );
}
