"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
	page: number;
	children: ReactNode;
	isActive?: boolean;
	onClick?: () => void;
	ariaLabel?: string;
	disabled?: boolean;
};

export default function PaginationButton({
	page,
	children,
	isActive,
	onClick,
	ariaLabel,
	disabled,
}: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleClick = () => {
		if (disabled) return;
		if (onClick) {
			onClick();
			return;
		}
		const urlSearchParams = new URLSearchParams(searchParams.toString());
		urlSearchParams.set('page', page.toString());
		const url = `${pathname}?${urlSearchParams.toString()}`;
		router.push(url);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			title="Next page"
			aria-current={isActive ? 'page' : undefined}
			aria-label={ariaLabel}
			disabled={disabled}
			className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
				isActive
					? 'bg-ink text-cream shadow-[0_4px_12px_-4px_rgba(36,23,8,0.4)]'
					: 'border border-ink/10 bg-white text-brown hover:border-orange hover:text-orange'
			}`}
		>
			{children}
		</button>
	);
}
