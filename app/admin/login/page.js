import { getAdminText } from "@/lib/adminText";
import { getBusinessInfo } from "@/lib/businessInfo";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getModuleStates, isEnabled } from "@/lib/plan";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const [adminText, business, moduleStates] = await Promise.all([
    getAdminText(),
    getBusinessInfo(),
    getModuleStates(),
  ]);

  return (
    <AdminLoginForm
      businessName={business.name}
      heading={adminText.login_heading}
      subheading={adminText.login_subheading}
      themesEnabled={isEnabled("themes", moduleStates)}
    />
  );
}
