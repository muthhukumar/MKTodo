import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {CiLogout} from "react-icons/ci"
import {useAuth} from "~/auth-context"
import toast from "react-hot-toast"
import {useNavigate} from "@tanstack/react-router"

export default function Logout() {
  const [showConfirmationModal, setShowConfirmationModal] = React.useState(false)
  const {logout} = useAuth()

  const navigate = useNavigate({from: location.pathname})

  function onLogout() {
    toast.success("Logging out...")
    logout()

    setShowConfirmationModal(false)

    setTimeout(() => {
      navigate({to: "/login"})
    }, 1200)
  }

  return (
    <>
      <button onClick={() => setShowConfirmationModal(true)}>
        <CiLogout size={22} />
      </button>
      <LogoutConfirmationModal
        open={showConfirmationModal}
        onDismiss={() => setShowConfirmationModal(false)}
        onConfirm={onLogout}
      />
    </>
  )
}

function LogoutConfirmationModal({
  onDismiss,
  open,
  onConfirm,
}: {
  open: boolean
  onDismiss: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onDismiss}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content border rounded-md border-border bg-background">
          <Dialog.Title className="dialog-title text-center">Logout</Dialog.Title>
          <Dialog.Description className="font-bold dialog-description">
            Are you sure you want to logout
          </Dialog.Description>
          <div className="flex justify-center items-center gap-3">
            <Dialog.Close className="dialog-close">Cancel</Dialog.Close>
            <button className="border rounded-md px-3 py-1" type="button" onClick={onConfirm}>
              Logout
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
