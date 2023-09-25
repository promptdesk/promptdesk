"use client";
import Link from 'next/link';
import React from 'react';

//set text and conlick function as props
function Navigation() {

  return (
    <div className="app-header">
        <div className="left-menu">
            <div className="branding">
            <Link className="logo-link" href="/prompts">
                    <span style={{ fontSize: 22, fontWeight: "bold" }}>
                    Prompt<span style={{ color: "dodgerblue" }}>Desk</span>
                    </span>
            </Link>
            </div>
            <div className="menu-container">
            <Link className="nav-item" href="/prompts">
                Prompts
            </Link>
            <Link className="nav-item" href="/models">
                Models
            </Link>
            <Link className="nav-item" href="/logs">
                Logs
            </Link>
            <Link className="nav-item" href="/variables">
                Variables
            </Link>
            {/*<a className="nav-item" href="/docs/api-reference">
                API reference
            </a>
            <a className="nav-item" href="/examples">
                Examples
            </a>
            <a aria-current="page" className="nav-item active" href="/playground">
                Playground
            </a>*/}
            </div>
        </div>
        {/*<div className="right-menu">
            <div className="header-support">
            <button
                tabIndex={0}
                className="btn btn-md btn-minimal btn-neutral header-support-btn"
                type="button"
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
                <span className="btn-label-inner">Help‍</span>
                </span>
            </button>
            </div>
            <div className="user-section" aria-haspopup="true" aria-expanded="false">
            <div className="avatar mr-2">
                <img
                src="https://lh3.googleusercontent.com/a/AAcHTteOUqaJno8cI1xug7-rbq7BAwRl90nlehQMUfdujWMtQw=s96-c"
                height="100%"
                width="100%"
                alt="Profile"
                />
            </div>
            <div className="user-details">
                <div className="user-details-org">PromptDesk</div>
            </div>
            </div>
        </div>
        <div className="mobile-menu-toggle" role="button">
            <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
            />
            </svg>
        </div>
        <div className="mobile-menu-toggle" role="button">
            <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
            />
            </svg>
        </div>*/}
        </div>
  )
};

export default Navigation;