// pages/_app.js
import '../styles/globals.css'
import Layout from '../components/Layout'

// 1️⃣ Bring in the Use-Wallet providers and types
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider
} from '@txnlab/use-wallet-react'

// we import the adapter libraries so they're registered
import '@perawallet/connect'        // Pera Wallet adapter
import '@blockshake/defly-connect'  // Defly adapter


export default function MyApp({ Component, pageProps }) {
  // Only register the Algorand-native wallets you want:
  const walletManager = new WalletManager({
    wallets: [
      { id: WalletId.PERA      }, // Pera Mobile
      { id: WalletId.DEFLY     }, // Defly
      
    ],
    defaultNetwork: NetworkId.MAINNET
  })

  console.log('WalletManager initialized:', walletManager);
  console.log('Registered wallets:', walletManager.wallets);

  return (
    <WalletProvider manager={walletManager}>
      {Component.noLayout
        ? <Component {...pageProps}/>
        : <Layout><Component {...pageProps}/></Layout>}
    </WalletProvider>
  )
}
