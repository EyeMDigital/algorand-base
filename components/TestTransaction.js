// components/TestTransaction.js
import { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';

export default function TestTransaction() {
  const { activeWallet, accounts } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('0.001');  // in ALGO
  const [status, setStatus] = useState('');

  // Nodely MainNet endpoint (no token)
  const algodClient = new algosdk.Algodv2(
    '',
    'https://mainnet-api.4160.nodely.dev',
    443
  );

  async function sendTx() {
    if (!activeWallet || !accounts || accounts.length === 0) {
      setStatus('❗️ Connect your wallet first');
      return;
    }
    if (!to.trim()) {
      setStatus('❗️ Enter a destination address');
      return;
    }

    try {
      setStatus('⏳ Building transaction…');
      const params = await algodClient.getTransactionParams().do();

      // convert ALGO → microAlgos
      const microAlgos = Math.round(Number(amount) * 1e6);

      // take the first connected address
      const sender = accounts[0];
      if (!sender) throw new Error('Sender address is empty');

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from:            sender,
        to:              to.trim(),
        amount:          microAlgos,
        suggestedParams: params,
      });

      setStatus('🖋️ Waiting for wallet signature…');
      // some adapters expect a Uint8Array; if .toByte() is wrong, try txn.toByte() or txn.toByteArray()
      const signed = await activeWallet.signTransaction(txn.toByte());
      const blob = signed.blob ?? signed;   // support different return shapes

      setStatus('📡 Submitting to network…');
      const { txId } = await algodClient.sendRawTransaction(blob).do();

      setStatus(`🔎 Waiting confirmation for ${txId}…`);
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setStatus(`✅ Transaction confirmed: ${txId}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  }

  const isDisabled =
    !activeWallet ||
    !accounts ||
    accounts.length === 0 ||
    !to.trim() ||
    Number(amount) <= 0;

  return (
    <div style={{ marginTop: '1.5rem', fontFamily: 'sans-serif' }}>
      <h3>MainNet Payment Test</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Destination address"
          value={to}
          onChange={e => setTo(e.target.value)}
          style={{ flex: '1 1 300px', padding: '0.5rem' }}
        />
        <input
          placeholder="Amount (ALGO)"
          type="number"
          step="0.000001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ width: '120px', padding: '0.5rem' }}
        />
        <button
          onClick={sendTx}
          disabled={isDisabled}
          style={{
            padding: '0.5rem 1rem',
            background: isDisabled ? '#999' : '#1e4f5b',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {isDisabled ? 'Send Disabled' : 'Send'}
        </button>
      </div>

      {status && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.9em' }}>
          {status}
        </p>
      )}
    </div>
  );
}
