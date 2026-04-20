'use client'
import { useAdminGuard } from "../login/lib/useAdminGuard";

const AdminDashboard = () => {
 const checked = useAdminGuard();

  if (!checked) return null;

  return (
    <>
        Админ панель
    </>
  )
}

export default AdminDashboard