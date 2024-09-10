import { useState, useEffect } from 'react';
import { AlertTriangle, Database, GitCommit, RefreshCw, ToggleLeft, ToggleRight, X } from 'lucide-react';

type Deposit = {
  blockNumber: number;
  blockTimestamp: string;
  fee: string;
  hash: string;
  pubkey?: string;
};

export default function Dashboard() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastBlock, setLastBlock] = useState(0);
  const [isExternal, setIsExternal] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000); // Sync every 20 seconds
    return () => clearInterval(interval);
  }, [isExternal]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/deposits`);
      const data = await response.json();
      setDeposits(data.deposits); // Access the deposits array
      setIsConnected(true);
      if (data.deposits.length > 0) {
        setLastBlock(data.deposits[0].blockNumber);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsConnected(false);
    }
  };

  const toggleTransactionType = () => {
    setIsExternal(!isExternal);
  };

  const showDepositDetails = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
  };

  const closeDepositDetails = () => {
    setSelectedDeposit(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10 bg-cover"></div>
      <div className="relative z-10 flex-grow flex flex-col p-4">
        <header className="mb-8 border-b border-green-500 pb-4">
          <h1 className="text-4xl font-bold mb-2 glitch" data-text="ETH DEPOSIT TRACKER">ETH DEPOSIT TRACKER</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'} animate-pulse`}>
              <Database className="mr-2" size={16} />
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
            <span className="flex items-center">
              <GitCommit className="mr-2" size={16} />
              LAST BLOCK: {lastBlock}
            </span>
            <button
              onClick={fetchData}
              className="ml-auto bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400 transition-colors flex items-center"
            >
              <RefreshCw className="mr-2" size={16} />
              SYNC
            </button>
          </div>
        </header>

        <main className="flex-grow">
          <div className="mb-4 h-16 overflow-hidden relative">
            <div className="data-stream absolute inset-0 flex items-center">
              {Array.from({ length: 50 }).map((_, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-green-900 bg-opacity-50 text-green-400 text-xs rounded mr-2"
                  style={{
                    animation: `dataStream 20s linear infinite`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {Math.random().toString(16).substr(2, 8)}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isExternal ? 'External' : 'Internal'} Transactions
            </h2>
            <button
              onClick={toggleTransactionType}
              className="flex items-center bg-green-900 bg-opacity-50 text-green-400 px-4 py-2 rounded hover:bg-opacity-75 transition-colors"
            >
              {isExternal ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
              <span className="ml-2">{isExternal ? 'Switch to Internal' : 'Switch to External'}</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-900 bg-opacity-50">
                  <th className="p-2 border-b border-green-500">BLOCK</th>
                  <th className="p-2 border-b border-green-500">TIMESTAMP</th>
                  <th className="p-2 border-b border-green-500">FEE (ETH)</th>
                  <th className="p-2 border-b border-green-500">HASH</th>
                  {isExternal && <th className="p-2 border-b border-green-500">PUBKEY</th>}
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-900 hover:bg-opacity-30 transition-colors cursor-pointer"
                    onClick={() => showDepositDetails(deposit)}
                  >
                    <td className="p-2 border-b border-green-800">{deposit.blockNumber}</td>
                    <td className="p-2 border-b border-green-800">{new Date(deposit.blockTimestamp).toLocaleString()}</td>
                    <td className="p-2 border-b border-green-800">{deposit.fee}</td>
                    <td className="p-2 border-b border-green-800 truncate max-w-xs">{deposit.hash}</td>
                    {isExternal && <td className="p-2 border-b border-green-800 truncate max-w-xs">{deposit.pubkey}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="mt-8 flex items-center justify-between text-sm border-t border-green-500 pt-4">
          <p>&copy; 2024 LUGANODES 21BIT0662 ETH TRACKER</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center">
            <AlertTriangle className="mr-2" size={16} />
            EMERGENCY STOP
          </button>
        </footer>

        {selectedDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <button onClick={closeDepositDetails} className="text-green-400 hover:text-green-300">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-2">
                <p><span className="font-bold">Block Number:</span> {selectedDeposit.blockNumber}</p>
                <p><span className="font-bold">Timestamp:</span> {new Date(selectedDeposit.blockTimestamp).toLocaleString()}</p>
                <p><span className="font-bold">Fee (ETH):</span> {selectedDeposit.fee}</p>
                <p><span className="font-bold">Hash:</span> <span className="break-all">{selectedDeposit.hash}</span></p>
                {selectedDeposit.pubkey && (
                  <p><span className="font-bold">Public Key:</span> <span className="break-all">{selectedDeposit.pubkey}</span></p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}