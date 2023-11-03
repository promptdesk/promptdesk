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
          <Link href="/workspace" className="logo-link">
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
        </div>
      </div>
      <div className="right-menu">
        {/*<div className="header-support">
          <a
            tabIndex={0}
            className="btn btn-md btn-minimal btn-neutral header-support-btn"
            target="_blank"
            href="https://community.openai.com/categories"
          >
            <span className="btn-label-wrap">
              <span className="btn-node">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zM293 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z" />
                  <path d="M894 345c-48.1-66-115.3-110.1-189-130v0.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l0.8 132.6c0 3.2 0.5 6.4 1.5 9.4 5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-0.5 0.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-223.5 150.5-348 102z m505-17l-8 10 1 104-98-33-12 5c-56 20.8-115.7 22.5-171 7l-0.2-0.1C613.7 788.2 680.7 742.2 729 676c76.4-105.3 88.8-237.6 44.4-350.4l0.6 0.4c23 16.5 44.1 37.1 62 62 72.6 99.6 68.5 235.2-8 330z" />
                  <path d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z" />
                </svg>
              </span>
              <span className="btn-label-inner">Forum‍</span>
            </span>
          </a>
        </div>*/}
        <div className="header-support">
          <a
            tabIndex={0}
            className="btn btn-md btn-minimal btn-neutral header-support-btn"
            href="https://promptdesk.ai/docs"
            target="_blank"
          >
            <span className="btn-label-wrap">
              <span className="btn-node">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                  <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z" />
                </svg>
              </span>
              <span className="btn-label-inner">Documentaion</span>
            </span>
          </a>
        </div>
        <a href="/logout" className="user-section" aria-haspopup="true" aria-expanded="false">
          {/*<div className="avatar mr-2">
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocKVplIUl0v3eB7A7Jb12g2Agpp_QBIcpKRO2E1cHFuejw=s96-c"
              height="100%"
              width="100%"
              alt="Profile"
            />
          </div>*/}
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