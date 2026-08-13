import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Settings, Info, Utensils, Printer, Plus, Minus, Trash2, PlusCircle, Receipt } from 'lucide-react';

export const TableMatrix = () => {
  const { 
    tables, 
    reservations, 
    updateTableStatus, 
    menuItems,
    fetchActiveTableOrder,
    createTableOrder,
    updateTableOrderItems,
    settleTableOrder 
  } = useRestaurant();

  const [selectedTable, setSelectedTable] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [selectedItemToAdd, setSelectedItemToAdd] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400';
      case 'Seated': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400';
      case 'Dirty': return 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const locations = [...new Set(tables.map(t => t.location))].sort();

  const handleStatusChange = (newStatus) => {
    if (selectedTable) {
      updateTableStatus(selectedTable.id, newStatus);
      setSelectedTable({ ...selectedTable, status: newStatus });
    }
  };

  const activeReservation = selectedTable?.status === 'Seated' 
    ? reservations.find(r => r.tableId === selectedTable.id && r.status === 'Seated')
    : null;

  useEffect(() => {
    if (selectedTable && selectedTable.status === 'Seated') {
      setLoadingOrder(true);
      fetchActiveTableOrder(selectedTable.id)
        .then(order => {
          setActiveOrder(order);
          setLoadingOrder(false);
        })
        .catch(err => {
          console.error("Error fetching active table order:", err);
          setLoadingOrder(false);
        });
    } else {
      setActiveOrder(null);
    }
    setSelectedItemToAdd('');
    setItemQuantity(1);
    setShowReceipt(false);
  }, [selectedTable]);

  const handleCreateOrder = async () => {
    if (!selectedTable) return;
    setLoadingOrder(true);
    const order = await createTableOrder(selectedTable.id, [], activeReservation?.customerId || null);
    if (order) {
      setActiveOrder(order);
    }
    setLoadingOrder(false);
  };

  const handleAddItem = async () => {
    if (!activeOrder || !selectedItemToAdd) return;
    const menuItem = menuItems.find(m => m.id === selectedItemToAdd);
    if (!menuItem) return;

    const existingItemIdx = activeOrder.items.findIndex(item => (item.menuItemId || item.id) === menuItem.id);
    let updatedItems = [...activeOrder.items];

    if (existingItemIdx > -1) {
      updatedItems[existingItemIdx] = {
        ...updatedItems[existingItemIdx],
        quantity: updatedItems[existingItemIdx].quantity + itemQuantity
      };
    } else {
      updatedItems.push({
        id: menuItem.id,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: itemQuantity
      });
    }

    const updatedOrder = await updateTableOrderItems(activeOrder.id, updatedItems);
    if (updatedOrder) {
      const refreshed = await fetchActiveTableOrder(selectedTable.id);
      setActiveOrder(refreshed);
    }
    setSelectedItemToAdd('');
    setItemQuantity(1);
  };

  const handleUpdateQty = async (itemId, newQty) => {
    if (!activeOrder) return;
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    const updatedItems = activeOrder.items.map(item => {
      const matchId = item.menuItemId || item.id;
      if (matchId === itemId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    const updatedOrder = await updateTableOrderItems(activeOrder.id, updatedItems);
    if (updatedOrder) {
      const refreshed = await fetchActiveTableOrder(selectedTable.id);
      setActiveOrder(refreshed);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!activeOrder) return;
    const updatedItems = activeOrder.items.filter(item => (item.menuItemId || item.id) !== itemId);
    const updatedOrder = await updateTableOrderItems(activeOrder.id, updatedItems);
    if (updatedOrder) {
      const refreshed = await fetchActiveTableOrder(selectedTable.id);
      setActiveOrder(refreshed);
    }
  };

  const handleSettleBill = async () => {
    if (!activeOrder || !selectedTable) return;
    if (window.confirm("Are you sure you want to settle this bill and checkout the table?")) {
      const success = await settleTableOrder(activeOrder.id, selectedTable.id);
      if (success) {
        setSelectedTable(null);
      } else {
        alert("Failed to settle the bill. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Table Matrix</h1>
          <p className="text-muted-foreground">Live overview of the restaurant floor and table statuses.</p>
        </div>
        <div className="flex gap-4 text-sm bg-card px-4 py-2 rounded-full border shadow-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Seated</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Dirty</div>
        </div>
      </div>

      <div className="space-y-8">
        {locations.map(location => (
          <div key={location} className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2 border-b pb-2">
              <Utensils className="h-5 w-5 text-muted-foreground" /> {location}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {tables.filter(t => t.location === location).map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-[1.03] ${getStatusColor(table.status)} shadow-sm`}
                >
                  <span className="text-2xl font-bold mb-1">T{table.number}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider">{table.type} ({table.capacity})</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        {selectedTable && (
          <div className="max-h-[85vh] overflow-y-auto pr-1">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
                Table {selectedTable.number} <Badge variant="outline">{selectedTable.type}</Badge>
              </DialogTitle>
              <DialogDescription>
                Manage table status and view seated guests.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Change Status
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedTable.status === 'Available' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Available')}
                    className={selectedTable.status === 'Available' ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'border-green-200 text-green-700 hover:bg-green-50'}
                  >
                    Available
                  </Button>
                  <Button 
                    variant={selectedTable.status === 'Seated' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Seated')}
                    className={selectedTable.status === 'Seated' ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'border-red-200 text-red-700 hover:bg-red-50'}
                  >
                    Seated
                  </Button>
                  <Button 
                    variant={selectedTable.status === 'Dirty' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Dirty')}
                    className={selectedTable.status === 'Dirty' ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
                  >
                    Dirty
                  </Button>
                </div>
              </div>

              {activeReservation ? (
                <div className="bg-muted/50 p-4 rounded-lg space-y-3 border">
                  <h4 className="text-sm font-medium flex items-center gap-2 border-b pb-2">
                    <User className="h-4 w-4 text-primary" /> Seated Guests
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Name</div>
                      <div className="font-medium">{activeReservation.guestName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Party Size</div>
                      <div className="font-medium">{activeReservation.partySize} People</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3 text-sm text-muted-foreground border border-dashed">
                  <Info className="h-5 w-5 opacity-50" />
                  <span>No active reservation seated at this table.</span>
                </div>
              )}

              {selectedTable.status === 'Seated' && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" /> Table Billing & Active Orders
                  </h4>
                  {loadingOrder ? (
                    <div className="text-xs text-muted-foreground animate-pulse py-2 text-center">Loading billing data...</div>
                  ) : activeOrder ? (
                    <div className="space-y-3">
                      {activeOrder.items?.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded text-center">No items ordered yet.</p>
                      ) : (
                        <div className="max-h-48 overflow-y-auto border rounded-lg bg-card text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <th className="p-2">Item</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-right">Price</th>
                                <th className="p-2 text-right">Total</th>
                                <th className="p-2 text-center"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeOrder.items.map(item => {
                                const itemId = item.menuItemId || item.id;
                                return (
                                  <tr key={itemId} className="border-b last:border-0 hover:bg-muted/10">
                                    <td className="p-2 font-medium">{item.name}</td>
                                    <td className="p-2">
                                      <div className="flex items-center justify-center gap-1">
                                        <button 
                                          onClick={() => handleUpdateQty(itemId, item.quantity - 1)} 
                                          className="p-0.5 rounded hover:bg-muted text-muted-foreground"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-4 text-center font-mono">{item.quantity}</span>
                                        <button 
                                          onClick={() => handleUpdateQty(itemId, item.quantity + 1)}
                                          className="p-0.5 rounded hover:bg-muted text-muted-foreground"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="p-2 text-right font-mono">${item.price.toFixed(2)}</td>
                                    <td className="p-2 text-right font-mono font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                    <td className="p-2 text-center">
                                      <button 
                                        onClick={() => handleRemoveItem(itemId)}
                                        className="text-destructive hover:text-destructive/80 p-1 rounded"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex gap-2 items-center bg-muted/30 p-2 rounded-lg border border-dashed">
                        <select 
                          className="flex-1 bg-background border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                          value={selectedItemToAdd}
                          onChange={(e) => setSelectedItemToAdd(e.target.value)}
                        >
                          <option value="">+ Add Item to Bill...</option>
                          {menuItems.map(m => (
                            <option key={m.id} value={m.id}>{m.name} (${m.price})</option>
                          ))}
                        </select>
                        <input 
                          type="number" 
                          min="1" 
                          max="20"
                          className="w-12 bg-background border rounded px-2 py-1 text-xs text-center font-mono outline-none"
                          value={itemQuantity}
                          onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        />
                        <button 
                          onClick={handleAddItem}
                          disabled={!selectedItemToAdd}
                          className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
                        >
                          <PlusCircle className="h-3.5 w-3.5" /> Add
                        </button>
                      </div>

                      <div className="bg-muted/20 p-3 rounded-lg border text-xs space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal:</span>
                          <span className="font-mono">${activeOrder.total?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tax (18% GST):</span>
                          <span className="font-mono">${(activeOrder.total * 0.18 || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold border-t pt-1 mt-1">
                          <span>Grand Total:</span>
                          <span className="font-mono text-primary">${(activeOrder.total * 1.18 || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowReceipt(true)}
                          className="flex-1 border text-xs py-2 rounded font-medium hover:bg-muted flex items-center justify-center gap-1.5"
                          disabled={activeOrder.items?.length === 0}
                        >
                          <Printer className="h-3.5 w-3.5" /> Print Receipt
                        </button>
                        <button 
                          onClick={handleSettleBill}
                          className="flex-1 bg-green-600 text-white text-xs py-2 rounded font-medium hover:bg-green-700 flex items-center justify-center gap-1.5"
                          disabled={activeOrder.items?.length === 0}
                        >
                          <Receipt className="h-3.5 w-3.5" /> Settle & Checkout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-muted/20 border border-dashed rounded-lg space-y-3">
                      <p className="text-xs text-muted-foreground">No active bill initialized for this seated table.</p>
                      <button 
                        onClick={handleCreateOrder}
                        className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded font-medium hover:bg-primary/95 flex items-center gap-1.5 mx-auto"
                      >
                        <PlusCircle className="h-4 w-4" /> Start Bill / Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>

      <Dialog open={showReceipt} onOpenChange={(open) => !open && setShowReceipt(false)}>
        {showReceipt && activeOrder && (
          <div className="p-4 space-y-6 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-serif text-center font-bold tracking-widest text-primary uppercase">
                AuraDine
              </DialogTitle>
              <DialogDescription className="text-center text-xs tracking-wider uppercase">
                Fine Dining Restaurant & Lounge
              </DialogDescription>
            </DialogHeader>

            <div className="border-t border-b border-dashed py-4 my-2 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span>RECEIPT: #{activeOrder.id}</span>
                <span>TABLE: T{selectedTable?.number}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE: {new Date(activeOrder.createdAt || Date.now()).toLocaleDateString()}</span>
                <span>TIME: {new Date(activeOrder.createdAt || Date.now()).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GUEST: {activeReservation?.guestName || "Walk-in Guest"}</span>
                <span>PARTY SIZE: {activeReservation?.partySize || "-"}</span>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
              <div className="border-b pb-1 font-semibold flex justify-between">
                <span>Item Name</span>
                <span className="w-16 text-center">Qty</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-20 text-right">Total</span>
              </div>
              {activeOrder.items.map(item => (
                <div key={item.menuItemId || item.id} className="flex justify-between">
                  <span className="truncate flex-1 pr-2">{item.name}</span>
                  <span className="w-16 text-center">{item.quantity}</span>
                  <span className="w-16 text-right">${item.price.toFixed(2)}</span>
                  <span className="w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-4 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${activeOrder.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span>${(activeOrder.total * 0.09 || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span>${(activeOrder.total * 0.09 || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-dashed pt-2 mt-2">
                <span>Grand Total:</span>
                <span>${(activeOrder.total * 1.18 || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center space-y-4 border-t border-dashed pt-4">
              <div className="text-[10px] text-muted-foreground font-serif italic">
                Thank you for dining at AuraDine.
                <br />
                We hope to see you again soon!
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReceipt(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => window.print()}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  Print Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
