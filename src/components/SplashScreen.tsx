import Logo from "../assets/logo.png"

export default function SplashScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src={Logo} />
      <h2 className="text-center font-bold text-6xl">MKTodo</h2>
    </div>
  )
}
