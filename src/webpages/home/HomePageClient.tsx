'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

export default function HomePageClient() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    const fetchWalletDetails = async () => {
      const address = Cookies.get('phantom-wallet')
      if (address) {
        try {
          setWalletAddress(address)
          
          // Initialize connection to Solana devnet
          const connection = new Connection(clusterApiUrl('devnet'))
          
          // Get wallet balance
          const publicKey = new PublicKey(address)
          const balanceInLamports = await connection.getBalance(publicKey)
          setBalance(balanceInLamports / 10 ** 9) // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching wallet details:', error)
        }
      }
    }

    fetchWalletDetails()
  }, [])

  const handleLogout = async () => {
    try {
      // Disconnect wallet
      const wallet = new PhantomWalletAdapter()
      if (wallet.connected) {
        await wallet.disconnect()
      }
      
      // Clear cookies and redirect
      Cookies.remove('phantom-wallet')
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
      // Still remove cookies and redirect even if disconnect fails
      Cookies.remove('phantom-wallet')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <p className="text-gray-600">Connected Wallet Address:</p>
            <p className="font-mono break-all text-black">{walletAddress}</p>
          </div>
          <div>
            <p className="text-gray-600">Balance:</p>
            <p className="font-mono text-black">{balance} SOL</p>
          </div>
        </div>
      </div>
    </div>
  )
}
