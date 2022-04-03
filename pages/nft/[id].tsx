import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

interface Props {
  collection: Collection
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setIsLoading] = useState<boolean>(false)
  const [priceInEth, setPriceInEth] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const nftDrop = useNFTDrop(collection.address)
  const connectRef = useRef<HTMLDivElement>(null)

  const showOptions = () => {
    setIsOpen(!isOpen)
    connectRef.current?.classList.toggle('show__display')
  }

  // Auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // ---
  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setIsLoading(true)
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)

      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setIsLoading(false)
    }
    fetchNFTDropData()
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1 //how many unique NFTs you want to claim

    setIsLoading(true)

    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        // const receipt = tx[0].receipt // get transaction receipt
        // const claimedTokenId = tx[0].id // the id of the NFT claimed
        const claimedNFT = await tx[0].data() // (optional) get the claimed NFT metadata

        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={claimedNFT.metadata.image}
                    alt="nft_image"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    YAY... You Successfully Minted!!!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {claimedNFT.metadata.name}{' '}
                    <span className="font-bold text-blue-700">
                      {claimedNFT.metadata.description}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        ))
      })
      .catch((err) => {
        console.log(err)
        toast.error('Whoops... Something Went Wrong!', {
          duration: 8000,
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setIsLoading(false)
        toast.dismiss(notification)
      })
  }

  // walletConnect

  // Create a connector
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    qrcodeModal: QRCodeModal,
    // Required
    clientMeta: {
      description: 'Get the best NFT Drops',
      url: 'https://nft-web3.vercel.app',
      icons: ['https://www.svgrepo.com/show/217770/m.svg'],
      name: 'Mal NFT Market Place',
    },
  })

  // Check if connection is already established
  const connectWithWallectconnect = () => {
    if (!connector.connected && !address) {
      // create new session
      connector.createSession()
    }
  }

  // Subscribe to connection events
  connector.on('connect', (error, payload) => {
    if (error) {
      console.log(error)
    }

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0]
    console.log(payload)
  })

  connector.on('session_update', (error, payload) => {
    if (error) {
      console.log(error)
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0]
  })

  connector.on('disconnect', (error, payload) => {
    if (error) {
      console.log(error)
    }

    // Delete connector
  })

  return (
    <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-blue-800">
      <Head>
        <title>Mal NFT Drops</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        <Toaster position="bottom-center" />
        {/* Left  */}
        <div className="bg-gradient-to-br from-blue-800 to-cyan-400 lg:col-span-4">
          <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
            <div className="animate-pulse rounded-xl bg-gradient-to-br from-teal-300 to-yellow-100 p-2">
              <img
                className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
                src={urlFor(collection.previewImage).url()}
                alt="mal-apes"
              />
            </div>

            <div className="space-y-2 p-5 text-center">
              <h1 className="text-4xl font-bold text-white">
                {collection.nftCollectionName}
              </h1>
              <p className="text-xl text-gray-300">{collection.description}</p>
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
            <div className="relative flex items-center">
              <div
                className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 lg:px-5 lg:py-3 lg:text-base"
                onClick={() => {
                  showOptions()
                }}
              >
                {!address ? (
                  <span className="flex items-center justify-center">
                    Connect Wallet{' '}
                    {!isOpen ? (
                      <ArrowDownIcon className="ml-2 h-5" />
                    ) : (
                      <ArrowUpIcon className="ml-2 h-5" />
                    )}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {address.substring(0, 5)}...
                    {address.substring(address.length - 5)}
                    {!isOpen ? (
                      <ArrowDownIcon className="ml-2 h-5" />
                    ) : (
                      <ArrowUpIcon className="ml-2 h-5" />
                    )}
                  </span>
                )}
              </div>
              <div
                ref={connectRef}
                className="absolute -bottom-10 left-1/2 hidden -translate-x-1/2 flex-col lg:-bottom-28"
              >
                {!address ? (
                  <button
                    onClick={() => {
                      connectWithMetamask()
                    }}
                    className="hidden items-center justify-center bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-800 lg:flex lg:px-5 lg:py-3 lg:text-base"
                  >
                    Metamask
                  </button>
                ) : (
                  <button
                    onClick={() => disconnect()}
                    className="flex items-center justify-center bg-gray-400 px-4 py-2 text-xs font-bold text-white hover:bg-gray-500 lg:px-5 lg:py-3 lg:text-base"
                  >
                    Disconnect
                  </button>
                )}
                {!address ? (
                  <button
                    onClick={() => {
                      connectWithWallectconnect()
                    }}
                    className="hidden items-center justify-center bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-800 lg:flex lg:px-5 lg:py-3 lg:text-base"
                  >
                    walletConnect
                  </button>
                ) : (
                  <button
                    onClick={() => disconnect()}
                    className="flex items-center justify-center bg-gray-400 px-4 py-2 text-xs font-bold text-white hover:bg-gray-500 lg:px-5 lg:py-3 lg:text-base"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
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
              src={urlFor(collection.mainImage).url()}
              alt="content-image"
            />

            <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
              {collection.title}
            </h1>
            {loading ? (
              <p className="animate-pulse pt-2 text-xl text-green-500">
                Loading Supply Count...
              </p>
            ) : (
              <p className="py-4 text-xl text-green-500">
                {claimedSupply} / {totalSupply?.toString()} NFT's claimed
              </p>
            )}
          </div>
          {/* Mint Button */}
          {loading && (
            // <img
            //   className="h-80 w-80 object-contain"
            //   src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            //   alt=""
            // />
            <div className="mt-4 flex h-10 w-10 animate-spin self-center rounded-full border-b-2 border-green-500 lg:h-16 lg:w-16"></div>
          )}
          <button
            onClick={() => {
              mintNft()
            }}
            disabled={
              loading || claimedSupply === totalSupply?.toNumber() || !address
            }
            className="mt-10 h-16 w-full rounded-full bg-blue-600 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>Loading</>
            ) : claimedSupply === totalSupply?.toNumber() ? (
              <>SOLD OUT</>
            ) : !address ? (
              <>Sign in to Mint</>
            ) : (
              <span className="font-bold">MINT NFT ({priceInEth} ETH)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
  _id,
  title,
  description,
  nftCollectionName,
  address,
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return { notFound: true }
  }

  return {
    props: { collection },
  }
}
