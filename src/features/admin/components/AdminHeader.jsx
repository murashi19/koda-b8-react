import { BsBellFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";

export default function Header({
  onToggleSidebar,
  title = "Admin",
  avatarInitial = "A",
  adminName = "Admin",
}) {
  return (
    <>
      <header className="h-18 bg-white border-b border-border flex items-center justify-between px-8 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <FiMenu className="text-[18px]" />
          </button>
          <span className="font-medium text-text-primary">{title}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer">
            <BsBellFill className="text-[18px] text-text-secondary" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {avatarInitial}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {adminName}
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
