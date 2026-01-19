import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outlined";
}

const variants = {
    default: "bg-white border border-slate-200 shadow-sm",
    elevated: "bg-white shadow-lg shadow-slate-200/50",
    outlined: "bg-transparent border-2 border-slate-200",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = "default", className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`rounded-2xl ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Sub-components
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", children, ...props }, ref) => (
        <div ref={ref} className={`p-6 pb-0 ${className}`} {...props}>
            {children}
        </div>
    )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", children, ...props }, ref) => (
        <h3 ref={ref} className={`text-lg font-semibold text-slate-900 ${className}`} {...props}>
            {children}
        </h3>
    )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", children, ...props }, ref) => (
        <p ref={ref} className={`text-sm text-slate-500 mt-1 ${className}`} {...props}>
            {children}
        </p>
    )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", children, ...props }, ref) => (
        <div ref={ref} className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", children, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 flex items-center gap-4 ${className}`} {...props}>
            {children}
        </div>
    )
);
CardFooter.displayName = "CardFooter";
