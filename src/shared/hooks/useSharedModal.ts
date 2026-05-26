import { useContext } from 'react';
import { SharedModalContext } from '../components/SharedModalContext';

export function useSharedModal() {
	const context = useContext(SharedModalContext);

	if (!context) {
		throw new Error('useSharedModal debe usarse dentro de SharedModalProvider.');
	}

	return context;
}
