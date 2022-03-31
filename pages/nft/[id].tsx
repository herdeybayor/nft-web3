import { useState, useEffect } from 'react'
import Head from 'next/head'
import { KeyIcon, LogoutIcon } from '@heroicons/react/outline'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import Link from 'next/link'

const NFTDropPage = () => {
  const [isSigningIn, setIsSigningIn] = useState(false)
  // Auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // ---

  useEffect(() => {
    if (address) {
      setIsSigningIn(false)
    }
  }, [address])

  return (
    <div>
      <Head>
        <title>Mal NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        {/* Left  */}
        <div className="bg-gradient-to-br from-blue-800 to-cyan-400 lg:col-span-4">
          <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
            <div className="animate-pulse rounded-xl bg-gradient-to-br from-teal-300 to-yellow-100 p-2">
              <img
                className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
                src="https://links.papareact.com/8sg"
                alt="mal-apes"
              />
            </div>

            <div className="space-y-2 p-5 text-center">
              <h1 className="text-4xl font-bold text-white">Mal Apes</h1>
              <p className="text-xl text-gray-300">
                A collection of Mal Apes who live & breathe React!🤪
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <Link href={'/'}>
              <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
                <span className="font-extrabold underline decoration-blue-600/50">
                  Mal
                </span>{' '}
                NFT Market Place
              </h1>
            </Link>
            {!address ? (
              <button
                onClick={() => {
                  connectWithMetamask()
                  setIsSigningIn(true)
                }}
                className="flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 lg:px-5 lg:py-3 lg:text-base"
              >
                {!isSigningIn ? (
                  <div className="flex">
                    Sign In
                    <KeyIcon className="h-3 animate-bounce pl-2 lg:h-5" />
                  </div>
                ) : (
                  <div className="h-3 w-3 animate-spin rounded-full border-t-2 border-white lg:h-5 lg:w-5"></div>
                )}
              </button>
            ) : (
              <button
                onClick={() => disconnect()}
                className="flex items-center rounded-full bg-gray-400 px-4 py-2 text-xs font-bold text-white hover:bg-gray-500 lg:px-5 lg:py-3 lg:text-base"
              >
                Sign Out
                <LogoutIcon className="h-3 animate-bounce pl-2 lg:h-5" />
              </button>
            )}
          </header>

          <hr className="my-2 border" />
          {address && (
            <p className="text-center text-sm text-blue-500">
              You're logged in with wallet {address.substring(0, 5)}...
              {address.substring(address.length - 5)}
            </p>
          )}

          {/* Content */}
          <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
            <img
              className="w-80 object-cover pb-10 lg:h-40"
              src="https://links.papareact.com/bdy"
              alt="content-image"
            />

            <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
              Mal Ape Coding Club | NFT Drop
            </h1>

            <p className="pt-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
          </div>
          {/* Mint Button */}
          <button className="mt-10 h-16 w-full rounded-full bg-blue-600 font-bold text-white hover:bg-blue-800">
            Mint NFT (0.01ETH)
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTDropPage
