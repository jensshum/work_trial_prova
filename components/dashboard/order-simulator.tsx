'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, SimulateOrderRequest } from '@/lib/api';
import { Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OrderSimulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SimulateOrderRequest>({
    product_id: 1,
    quantity: 1,
    total_amount: 99.99,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.simulateOrder(formData);
      toast({
        title: "Order Simulated Successfully!",
        description: `Order #${result.id} has been created with status: ${result.status}`,
        duration: 3000,
      });
      
      // Trigger a page refresh to update analytics
      window.location.reload();
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate order. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SimulateOrderRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'product_id' || field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0,
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Order Simulator
        </CardTitle>
        <CardDescription>
          Create test orders to see real-time analytics updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">Product ID</Label>
              <Input
                id="product_id"
                type="number"
                min="1"
                value={formData.product_id}
                onChange={(e) => handleInputChange('product_id', e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount ($)</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_amount}
                onChange={(e) => handleInputChange('total_amount', e.target.value)}
                placeholder="99.99"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              'Simulating...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Simulate Order
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}