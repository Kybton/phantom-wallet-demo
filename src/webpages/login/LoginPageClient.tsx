'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

export default function LoginPageClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantomInstallation = async () => {
      try {
        const { solana } = window as any
        setIsPhantomInstalled(!!solana?.isPhantom)
      } catch {
        setIsPhantomInstalled(false)
      }
    }
    
    checkPhantomInstallation()
  }, [])

  const handlePhantomInstall = () => {
    window.open('https://phantom.app/', '_blank')
  }

  const connectPhantom = async () => {
    try {
      setLoading(true)
      
      // Initialize Phantom Wallet adapter
      const wallet = new PhantomWalletAdapter()
      
      // Connect to Solana devnet
      const connection = new Connection(clusterApiUrl('devnet'))
      
      // Connect wallet
      await wallet.connect()
      
      if (!wallet.publicKey) {
        throw new Error('No public key found!')
      }

      const walletAddress = wallet.publicKey.toString()
      
      // Verify connection
      const balance = await connection.getBalance(wallet.publicKey)
      console.log('Wallet balance:', balance / 10 ** 9, 'SOL')
      
      // Save wallet address in cookies
      Cookies.set('phantom-wallet', walletAddress)
      
      // Redirect to home page
      router.push('/home')
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error)
      alert('Failed to connect to Phantom wallet. Make sure Phantom is installed!')
    } finally {
      setLoading(false)
    }
  }

  if (isPhantomInstalled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p>Checking for Phantom Wallet...</p>
        </div>
      </div>
    )
  }

  if (!isPhantomInstalled) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex w-[800px] h-[500px] rounded-lg shadow-2xl overflow-hidden">
          <div className="w-1/2 bg-black text-white p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">Phantom Wallet Required</h1>
            <p className="text-gray-300">
              To use this application, you need to install the Phantom Wallet browser extension.
            </p>
          </div>

          <div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center">
            <button
              onClick={handlePhantomInstall}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Install Phantom Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex w-[800px] h-[500px] rounded-lg shadow-2xl overflow-hidden">
        <div className="w-1/2 bg-black text-white p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Phantom Wallet Login</h1>
          <p className="text-gray-300">
            Welcome to your secure gateway. Connect with Phantom to get started.
          </p>
        </div>

        <div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center">
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={connectPhantom}
          >
            Connect with Phantom
          </button>
        </div>
      </div>
    </div>
  )
}
