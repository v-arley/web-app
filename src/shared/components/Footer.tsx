export type FooterAlert = {
	type: 'success' | 'error' | 'info';
	message: string;
};

type FooterProps = {
	label: string;
	alert?: FooterAlert | null;
};

export function Footer({ label, alert }: FooterProps) {
	const alertClassName =
		alert?.type === 'error'
			? 'feedback-error'
			: alert?.type === 'success'
				? 'feedback-success'
				: 'feedback-info';

	return (
		<footer className="page-footer">
			<div className="footer-feedback" aria-live="polite">
				{alert ? (
					<p className={`feedback-message ${alertClassName}`}>{alert.message}</p>
				) : (
					<p className="feedback-empty">Sin alertas activas.</p>
				)}
			</div>
			<p className="footer-clock">{label}</p>
		</footer>
	);
}