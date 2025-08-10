import '../styles/globals.css';
import Layout from '../components/Layout';
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider
} from '@txnlab/use-wallet-react';

import '@perawallet/connect';
import '@blockshake/defly-connect';

export default function MyApp({ Component, pageProps }) {
  const walletManager = new WalletManager({
    wallets: [
      { id: WalletId.PERA },
      { id: WalletId.DEFLY }
    ],
    defaultNetwork: NetworkId.MAINNET
  });

  return (
    <WalletProvider manager={walletManager}>
      {Component.noLayout
        ? <Component {...pageProps} />
        : <Layout><Component {...pageProps} /></Layout>}
    </WalletProvider>
  );
}
