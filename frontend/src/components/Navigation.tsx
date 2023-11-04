import React from 'react';
import Link from 'next/link';
import Help from './Icons/Help';
import Logo from './Logo';
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
          <Link href="/workspace" className="logo-link">
              <Logo/>
          </Link>
        </div>
        <div className="menu-container">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="nav-item">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="right-menu">
        <div className="header-support">
          <a
            tabIndex={0}
            className="btn btn-md btn-minimal btn-neutral header-support-btn"
            href="https://promptdesk.ai/docs"
            target="_blank"
          >
            <span className="btn-label-wrap">
              <span className="btn-node">
                <Help />
              </span>
              <span className="btn-label-inner">Documentaion</span>
            </span>
          </a>
        </div>
        <a href="/logout" className="user-section" aria-haspopup="true" aria-expanded="false">
          <div className="user-details">
            <div className="user-details-org" title="PromptDesk">
              Logout
            </div>
          </div>
        </a>
      </div>

    </div>
  )
}

export default Navigation;