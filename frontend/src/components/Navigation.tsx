import React, { useState } from 'react';
import Link from 'next/link';
import Help from './Icons/Help';
import Logo from './Logo';
import Playground from '@/components/Icons/Playground';
import Settings from '@/components/Icons/Settings';
import Logs from '@/components/Icons/Logs';
import Models from '@/components/Icons/Models';
import Folder from '@/components/Icons/Folder';
import Documentation from '@/components/Icons/Documentation';
import Logout from '@/components/Icons/Logout';

function Navigation() {
  const navItems = [
    { href: '/workspace', label: 'Playground', icon: Playground },
    { href: '/prompts', label: 'Prompts', icon: Folder },
    { href: '/models', label: 'Models', icon: Models },
    { href: '/logs', label: 'Logs', icon: Logs },
    { href: '/variables', label: 'Settings', icon: Settings }
  ];

  const footerItems = [
    { href: 'https://app.promptdesk.ai/docs', label: 'Documentation', icon: Documentation, target: '_blank' },
    { href: '/logout', label: 'Logout', icon: Logout }
  ]

      // State to track hover status
      const [isHovered, setIsHovered] = useState(false);

      // Event handler for mouse enter
      const handleMouseEnter = () => {
          setIsHovered(true);
      };
  
      // Event handler for mouse leave
      const handleMouseLeave = () => {
          setIsHovered(false);
      };
  
      // Determine the className
      const className = isHovered ? 'app-navigation fixed expanded' : 'app-navigation fixed';

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
      <div className="app-navigation-header">
        <div className="app-navigation-logo">
          <Link href="/workspace">
            <h1>P</h1>
          </Link>
        </div>
      </div>
      <div className="app-navigation-menu">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className="app-navigation-menu-item">
            <div className="app-navigation-menu-item-icon">
              <item.icon />
            </div>
            {isHovered && (
                <div className="app-navigation-menu-item-label">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="app-navigation-footer">
        {footerItems.map(item => (
          <Link key={item.href} href={item.href} className="app-navigation-menu-item" target={item.target}>
            <div className="app-navigation-menu-item-icon">
              <item.icon />
            </div>
            {isHovered && (
                <div className="app-navigation-menu-item-label">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navigation;

/*

active active-exact

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

    */