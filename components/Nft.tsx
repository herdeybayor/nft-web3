import Link from 'next/link'

const Nft = ({ nftName = '', href = '#' }) => {
  return (
    <Link href={href}>
      <div className="relative min-w-max cursor-pointer rounded-xl bg-gradient-to-br from-teal-300 to-yellow-100 p-2 shadow-lg transition-all duration-200 hover:scale-105 hover:from-yellow-100 hover:to-teal-300">
        <img
          className="w-44 rounded-xl object-cover sm:h-96 sm:w-72"
          src="https://links.papareact.com/8sg"
          alt="mal-apes"
        />
        <h1 className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white px-4 py-2 text-center text-xs font-bold lg:text-base">
          {nftName}
        </h1>
      </div>
    </Link>
  )
}

export default Nft
