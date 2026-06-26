import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

const config: Record<
  AlertVariant,
  { icon: typeof Info; classes: string }
> = {
  info: {
    icon: Info,
    classes: "bg-brand-500/5 border-brand-500/20 text-brand-600",
  },
  success: {
    icon: CheckCircle2,
    classes: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-orange-500/5 border-orange-500/20 text-orange-600",
  },
  error: {
    icon: AlertCircle,
    classes: "bg-red-500/5 border-red-500/20 text-red-600",
  },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  const { icon: Icon, classes } = config[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm",
        classes,
        className
      )}
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}

export default Alert;
