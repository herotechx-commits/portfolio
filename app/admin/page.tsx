'use client';

import AuthForms from "@/components/auth-forms";
import AdminDashboard from "@/components/admin-dashboard";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "@/components/loading";

export default function Admin() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />
  }
  return (
    <div>
      {user ? <AdminDashboard /> : <AuthForms />}
    </div>
  );
}