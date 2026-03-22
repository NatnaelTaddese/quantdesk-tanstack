"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
			{mounted && theme === "dark" ? (
				<MoonIcon weight="bold" />
			) : (
				<SunIcon weight="bold" />
			)}
		</Button>
	);
}
