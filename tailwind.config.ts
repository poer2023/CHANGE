import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Brand design system colors
				brand: {
					500: 'hsl(var(--brand-500))',
					600: 'hsl(var(--brand-600))'
				},
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					alt: 'hsl(var(--surface-alt))'
				},
				text: 'hsl(var(--text))',
				'text-muted': 'hsl(var(--text-muted))',
				// Status badge colors
				'status-draft': {
					bg: 'hsl(var(--status-draft-bg))',
					text: 'hsl(var(--status-draft-text))',
					border: 'hsl(var(--status-draft-border))'
				},
				'status-running': {
					bg: 'hsl(var(--status-running-bg))',
					text: 'hsl(var(--status-running-text))',
					border: 'hsl(var(--status-running-border))'
				},
				'status-ready': {
					bg: 'hsl(var(--status-ready-bg))',
					text: 'hsl(var(--status-ready-text))',
					border: 'hsl(var(--status-ready-border))'
				},
				'status-gate1': {
					bg: 'hsl(var(--status-gate1-bg))',
					text: 'hsl(var(--status-gate1-text))',
					border: 'hsl(var(--status-gate1-border))'
				},
				'status-addon': {
					bg: 'hsl(var(--status-addon-bg))',
					text: 'hsl(var(--status-addon-text))',
					border: 'hsl(var(--status-addon-border))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Design system border radius
				'card': '20px',
				'btn': '12px',
				'input': '12px'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'card-hover': 'var(--shadow-hover)'
			},
			backgroundImage: {
				'brand-gradient': 'var(--brand-gradient)'
			},
			fontSize: {
				'h1': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
				'h2': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
				'body': ['14px', { lineHeight: '1.45', fontWeight: '400' }]
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
