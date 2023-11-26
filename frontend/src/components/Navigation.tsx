import React, { useState } from 'react';
import Link from 'next/link';
import Help from './Icons/Help';
import Playground from '@/components/Icons/Playground';
import Settings from '@/components/Icons/Settings';
import Logs from '@/components/Icons/Logs';
import Models from '@/components/Icons/Models';
import Folder from '@/components/Icons/Folder';
import Documentation from '@/components/Icons/Documentation';
import Logout from '@/components/Icons/Logout';
import Logo from '@/components/Logo';

function Navigation() {
  const navItems = [
    { href: '/workspace', label: 'Playground', icon: Playground },
    { href: '/prompts', label: 'Prompts', icon: Folder },
    { href: '/models', label: 'Models', icon: Models },
    { href: '/logs', label: 'Logs', icon: Logs },
    { href: '/variables', label: 'Settings', icon: Settings }
  ];

  const footerItems = [
    { href: 'https://promptdesk.ai/docs', label: 'Documentation', icon: Documentation, target: '_blank' },
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
          <Link href="/WorkspaceHomeRedirector">
            <Logo />
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