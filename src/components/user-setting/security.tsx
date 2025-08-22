"use client"

import { useState } from "react"
import { Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

const Security = () => {
  const { user, login } = useAuth()

  const [newEmail, setNewEmail] = useState("")
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("")
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email", { className: "toast-error" })
      return
    }
    if (!currentPasswordForEmail) {
      toast.error("Please enter your current password", { className: "toast-error" })
      return
    }
    try {
      setIsSubmittingEmail(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ currentPassword: currentPasswordForEmail, newEmail }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Email updated successfully", { className: "toast-success" })
        // Try to refresh auth state using the new credentials
        await login(newEmail, currentPasswordForEmail)
        setNewEmail("")
        setCurrentPasswordForEmail("")
      } else {
        toast.error(data.error || "Failed to update email", { className: "toast-error" })
      }
    } catch {
      toast.error("Network error", { className: "toast-error" })
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill out both password fields", { className: "toast-error" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { className: "toast-error" })
      return
    }
    if (!currentPasswordForPassword) {
      toast.error("Please enter your current password", { className: "toast-error" })
      return
    }
    try {
      setIsSubmittingPassword(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ currentPassword: currentPasswordForPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Password updated successfully", { className: "toast-success" })
        // Re-login with new password using last known email
        const emailToUse = user?.email || ""
        if (emailToUse) {
          await login(emailToUse, newPassword)
        }
        setNewPassword("")
        setConfirmPassword("")
        setCurrentPasswordForPassword("")
      } else {
        toast.error(data.error || "Failed to update password", { className: "toast-error" })
      }
    } catch {
      toast.error("Network error", { className: "toast-error" })
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  return (
    <Card className="bg-gradient-surface border-border min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="change-email">Change Email</Label>
            <Input
              id="change-email"
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-background border-border"
            />
            <Input
              type="password"
              placeholder="Current password"
              value={currentPasswordForEmail}
              onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
              className="bg-background border-border"
            />
            <Button variant="outline" size="sm" onClick={handleUpdateEmail} disabled={isSubmittingEmail}>
              Update Email
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="change-password">Change Password</Label>
            <Input
              id="change-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-background border-border"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background border-border"
            />
            <Input
              type="password"
              placeholder="Current password"
              value={currentPasswordForPassword}
              onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
              className="bg-background border-border"
            />
            <Button variant="outline" size="sm" onClick={handleUpdatePassword} disabled={isSubmittingPassword}>
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
  )
}

export default Security