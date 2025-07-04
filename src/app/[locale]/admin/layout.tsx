import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import React from "react";
import AdminTabs from "./_components/AdminTabs";

const AdminLAyout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const translations = await getTrans(locale);
  return (
    <>
      <AdminTabs translations={translations} />
      {children}
    </>
  );
};

export default AdminLAyout;
