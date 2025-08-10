// components/ConnectButton.js
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

export default function ConnectButton() {
  const { wallets = [], activeWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build button label
  let label = 'Connect Wallet';
  if (activeWallet) {
    const { accounts = [], activeAccount } = activeWallet;
    const addr = activeAccount?.address || accounts[0]?.address || '';
    label = addr
      ? `${addr.slice(0, 6)}…${addr.slice(-4)}`
      : 'Connected';
  }

  return (
    <div ref={containerRef} className="wallet-container">
      <button
        className="wallet-button"
        onClick={() => setOpen(o => !o)}
      >
        {label}
      </button>

      {open && (
        <ul className="wallet-menu">
          {activeWallet ? (
            <li
              className="wallet-menu-item"
              onClick={() => {
                // catch and ignore any errors
                activeWallet.disconnect().catch(err => {
                  console.error('Disconnect failed:', err);
                  alert('Failed to disconnect wallet. Please try again.');
                });
                setOpen(false);
              }}
            >
              Disconnect
            </li>
          ) : (
            wallets.map(wallet => (
              <li
                key={wallet.id}
                className="wallet-menu-item"
                onClick={() => {
                  wallet.connect().catch(err => {
                    console.error('Connect failed:', err);
                    alert('Failed to connect wallet. Please try again.');
                  });
                  setOpen(false);
                }}
              >
                Connect {wallet.metadata.name}
              </li>
            ))
          )}
        </ul>
      )}

      <style jsx>{`
        .wallet-container {
          position: relative;
          display: inline-block;
        }
        .wallet-button {
          background: #2c2c2c;
          color: #fff;
          border: 2px solid #fff;
          padding: 0.6em 1em;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .wallet-button:hover {
          background: #4c4c4c;
        }
        .wallet-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.25em;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 4px;
          list-style: none;
          padding: 0;
          min-width: 160px;
          z-index: 10;
        }
        .wallet-menu-item {
          padding: 0.75em 1em;
          cursor: pointer;
          color: #fff;
          font-size: 1.1em;
          font-weight: 500;
          background: #2c2c2c;
        }
        .wallet-menu-item:hover {
          background: #4c4c4c;
        }
      `}</style>
    </div>
  );
}
