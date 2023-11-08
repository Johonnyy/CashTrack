export {};

declare global {
	interface Window {
		grecaptcha: {
			render: (id: string, parameters: { sitekey: string; callback: function }) => void;
			reset: (widgetId?: number) => void;
			getResponse: (widgetId?: number) => string;
		};
		onRecaptchaLoad: () => void;
	}
}
