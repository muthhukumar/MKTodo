import Loader from "../Loader"

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center p-3 h-screen w-full gap-3">
      <Loader loaderClass="dark-loader" />
      <p>Loading tasks...</p>
    </div>
  )
}
