import React from 'react';
import Link from 'next/link';

function Navigation() {
  const navItems = [
    { href: '/prompts', label: 'Prompts' },
    { href: '/models', label: 'Models' },
    { href: '/logs', label: 'Logs' },
    { href: '/variables', label: 'Settings' }
  ];

  return (
    <div className="app-header">
      <div className="left-menu">
        <div className="branding">
          <Link href="/prompts" className="logo-link">
              <span style={{ fontSize: 22, fontWeight: "bold" }}>
                Prompt<span style={{ color: "dodgerblue" }}>Desk</span>
              </span>
          </Link>
        </div>
        <div className="menu-container">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="nav-item">
              {item.label}
            </Link>
          ))}
          <a className="nav-item" target="_blank" rel="noopener noreferrer" href="https://promptdesk.ai/docs">
            Documentation
          </a>
        </div>
      </div>
    </div>
  )
}

export default Navigation;