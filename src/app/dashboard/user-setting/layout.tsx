import { ReactNode } from "react"

const UserSettingLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className="md:pt-10 md:px-10 space-y-10">
      <h1 className="font-bold text-3xl">User Setting</h1>
      {children}
    </div>
  )
}

export default UserSettingLayout