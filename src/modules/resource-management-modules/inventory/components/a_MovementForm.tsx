// components/MovementForm.tsx
import { useOptimistic, useTransition, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface StockItem {
  warehouse_id: number;
  resource_id: number;
  amount: number;
  min_quantity: number;
}

export function MovementForm({ stock }: { stock: StockItem[] }) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  
  // Estado optimista: se muestra inmediatamente al usuario
  const [optimisticStock, addOptimisticMovement] = useOptimistic(
    stock,
    (currentStock, movement: { resourceId: number; warehouseId: number; delta: number }) => {
      return currentStock.map(item => 
        item.resource_id === movement.resourceId && item.warehouse_id === movement.warehouseId
          ? { ...item, amount: item.amount + movement.delta }
          : item
      );
    }
  );

  const handleMovement = async (formData: FormData) => {
    const resourceId = parseInt(formData.get('resourceId') as string);
    const warehouseId = parseInt(formData.get('warehouseId') as string);
    const amount = parseInt(formData.get('amount') as string);
    const type = formData.get('type') as 'E' | 'S' | 'A';
    
    const delta = type === 'E' ? amount : type === 'S' ? -amount : 
                  (formData.get('sign') as string) === '+' ? amount : -amount;
    
    startTransition(async () => {
      // 1. Actualizar UI inmediatamente (optimista)
      addOptimisticMovement({ resourceId, warehouseId, delta });
      
      try {
        // 2. Llamar al servidor
        const response = await fetch('/api/v1/movements', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Error en el servidor');
        
        // 3. Invalidar cache para sincronizar con servidor
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
        
      } catch (error) {
        // 4. Rollback automático: useOptimistic revierte al estado real
        // cuando la transición termina sin éxito
        console.error('Movimiento falló:', error);
        // Mostrar toast de error
      }
    });
  };

  return (
    <form action={handleMovement}>
      {/* ... campos del formulario ... */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Procesando...' : 'Registrar Movimiento'}
      </button>
    </form>
  );
}