export default function Modal() {
  return (
    <div className="h-screen w-full">
      <div className="flex flex-col items-center justify-center bg-gray-300">
        <h1>You have Successfully Minted</h1>
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="animate-pulse rounded-xl bg-gradient-to-br from-teal-300 to-yellow-100 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://picsum.photos/200/200"
              alt="mal-apes"
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">A Mal Horse</h1>
            <p className="text-xl text-gray-300">A collection of Mal Horses</p>
          </div>
        </div>
      </div>
    </div>
  )
}
