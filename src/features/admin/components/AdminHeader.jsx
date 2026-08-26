import { BsBellFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Header({
  onToggleSidebar,
  title = "Admin",
}) {
  const user = useSelector((state) => state.auth.user);
  const adminName = user?.full_name || user?.email || "Admin";
  const avatarInitial = adminName.charAt(0).toUpperCase();

  return (
    <>
      <header className="h-18 flex shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka atau tutup sidebar"
            className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiMenu className="text-[18px]" />
          </button>
          <span className="font-medium text-text-primary">{title}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button type="button" aria-label="Notifikasi" className="relative p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer">
            <BsBellFill className="text-[18px] text-text-secondary" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {avatarInitial}
            </div>
            <span className="hidden text-sm font-medium text-text-primary sm:block">
              {adminName}
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
