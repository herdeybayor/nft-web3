import type { NextPage, GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { KeyIcon, LogoutIcon } from '@heroicons/react/outline'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import Nft from '../components/Nft'
import Link from 'next/link'
import { urlFor, sanityClient } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
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
    <div className="flex h-screen flex-col p-8 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-blue-800 lg:justify-between">
      <Head>
        <title>Mal NFT Drops</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div>
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
      </div>

      {/* Content */}
      <div className="flex flex-col items-center overflow-visible lg:space-y-5">
        <h1 className="lg: mt-10 text-center text-xl font-bold text-blue-600 lg:mt-0 lg:text-3xl lg:font-extrabold">
          NFT Drops
        </h1>

        <div className="my-5 flex flex-row flex-wrap space-y-5 rounded-sm p-5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-blue-800 sm:w-full sm:flex-row sm:flex-nowrap sm:space-y-0 sm:space-x-5 sm:overflow-x-scroll lg:my-0">
          {collections.map((collection) => (
            <Nft
              href={`/nft/${collection.slug.current}`}
              title={collection.title}
              img={urlFor(collection.mainImage).url()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
  _id,
  title,
  description,
  nftCollectionName,
  mainImage {
  asset
},
previewImage {
  asset
},
slug {
  current
},
creator-> {
  _id,
  name,
  address,
  slug {
  current
},
},
}`

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
