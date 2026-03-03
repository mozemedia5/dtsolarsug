import { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  Loader2,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { products, branches, getProductById } from '@/data';
import { usePreOrders } from '@/hooks';
import { submitReview } from '@/lib/firebaseService';
import type { PreOrder } from '@/types';

export function PreOrderPage() {
  const { preOrders, addPreOrder } = usePreOrders();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    branchId: branches[0].id,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerLocation: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<PreOrder[]>([]);
  const [hasTracked, setHasTracked] = useState(false);

  // Review state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<PreOrder | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const selectedProduct = formData.productId ? getProductById(formData.productId) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newOrder = addPreOrder({
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      branchId: formData.branchId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      customerLocation: formData.customerLocation,
      notes: formData.notes
    });

    setOrderReference(newOrder.id);
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      productId: '',
      quantity: 1,
      branchId: branches[0].id,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerLocation: '',
      notes: ''
    });

    setTimeout(() => setShowSuccess(false), 10000);
  };

  const handleTrackOrders = () => {
    if (!trackPhone) return;
    const orders = preOrders.filter(o => o.customerPhone === trackPhone);
    setTrackedOrders(orders);
    setHasTracked(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReview) return;

    setIsSubmittingReview(true);
    try {
      await submitReview({
        userName: selectedOrderForReview.customerName,
        rating: reviewRating,
        comment: reviewComment,
        productId: selectedOrderForReview.productId,
        date: new Date().toISOString()
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewDialogOpen(false);
        setReviewSuccess(false);
        setReviewComment('');
        setReviewRating(5);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatPrice = (price: number) => {
    return `UGX ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: PreOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const getStatusIcon = (status: PreOrder['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'ready': return <Package className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      case 'cancelled': return <Truck className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 pb-6">
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-2xl font-bold text-white mb-2">Pre-Order</h1>
          <p className="text-slate-400 text-sm">
            Place a pre-order and track your order status
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 mb-6">
            <TabsTrigger value="new" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Pre-Order
            </TabsTrigger>
            <TabsTrigger value="track" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              Track Order
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            {/* Success Message */}
            {showSuccess && (
              <Alert className="mb-6 bg-emerald-900/20 border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <AlertDescription className="text-emerald-300">
                  Pre-order placed successfully! Your order reference is: <strong>{orderReference}</strong>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-400" />
                        Select Product
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Product</Label>
                          <select
                            value={formData.productId}
                            onChange={(e) => setFormData({...formData, productId: e.target.value})}
                            required
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Select a product...</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} - {formatPrice(product.price)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedProduct && (
                          <div className="p-4 bg-slate-900/50 rounded-lg">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-8 h-8 text-orange-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{selectedProduct.name}</h3>
                                <p className="text-orange-400 font-semibold">{formatPrice(selectedProduct.price)}</p>
                                <p className="text-xs text-slate-400 mt-1">{selectedProduct.description}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-slate-300">Quantity</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                            required
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Select Branch</Label>
                          <select
                            value={formData.branchId}
                            onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                            required
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {branches.map(branch => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Additional Notes (Optional)</Label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            placeholder="Any special requests or delivery instructions..."
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-400" />
                        Your Details
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Full Name</Label>
                          <Input
                            placeholder="Enter your name"
                            value={formData.customerName}
                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Phone Number</Label>
                          <Input
                            placeholder="+256 7XX XXX XXX"
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Email (Optional)</Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-300">Your Location</Label>
                          <Input
                            placeholder="District, Town, Village"
                            value={formData.customerLocation}
                            onChange={(e) => setFormData({...formData, customerLocation: e.target.value})}
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Product:</span>
                          <span className="text-white">{selectedProduct?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Quantity:</span>
                          <span className="text-white">{formData.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Branch:</span>
                          <span className="text-white">
                            {branches.find(b => b.id === formData.branchId)?.name}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-700 pt-4 mb-4">
                        <div className="flex justify-between">
                          <span className="text-white font-medium">Total:</span>
                          <span className="text-orange-400 font-bold text-lg">
                            {selectedProduct 
                              ? formatPrice(selectedProduct.price * formData.quantity)
                              : '-'
                            }
                          </span>
                        </div>
                      </div>

                      <Button 
                        type="submit"
                        disabled={!selectedProduct || isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Place Pre-Order
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-slate-500 text-center mt-3">
                        We'll contact you within 24 hours to confirm your order
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="track">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Track Your Order</h2>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter your phone number"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
                    />
                    <Button 
                      onClick={handleTrackOrders}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {hasTracked && (
                <div className="space-y-4">
                  {trackedOrders.length > 0 ? (
                    <>
                      <p className="text-slate-400 text-sm">
                        Found {trackedOrders.length} order(s)
                      </p>
                      {trackedOrders.map((order) => (
                        <Card key={order.id} className="bg-slate-800/50 border-slate-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-xs text-slate-500">Order Reference</p>
                                <p className="text-white font-mono">{order.id}</p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-xs text-slate-500">Product</p>
                                <p className="text-white text-sm">{order.productName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Quantity</p>
                                <p className="text-white text-sm">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Branch</p>
                                <p className="text-white text-sm">
                                  {branches.find(b => b.id === order.branchId)?.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Date</p>
                                <p className="text-white text-sm">
                                  {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                              {['pending', 'ready', 'completed'].map((status, idx) => (
                                <div key={status} className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    ['pending', 'ready', 'completed'].indexOf(order.status) >= idx
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-slate-700 text-slate-500'
                                  }`}>
                                    {status === 'pending' && <Clock className="w-4 h-4" />}
                                    {status === 'ready' && <Package className="w-4 h-4" />}
                                    {status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                  </div>
                                  {idx < 2 && (
                                    <div className={`w-8 h-0.5 ${
                                      ['pending', 'ready', 'completed'].indexOf(order.status) > idx
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-700'
                                    }`} />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>Pending</span>
                              <span>Ready</span>
                              <span>Completed</span>
                            </div>

                            {/* Review Button for Completed Orders */}
                            {order.status === 'completed' && (
                              <div className="mt-6 pt-4 border-t border-slate-700">
                                <Button
                                  onClick={() => {
                                    setSelectedOrderForReview(order);
                                    setReviewDialogOpen(true);
                                  }}
                                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Rate & Review Product
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-white font-medium mb-2">No orders found</h3>
                      <p className="text-slate-400 text-sm">
                        We couldn't find any orders with this phone number
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Review {selectedOrderForReview?.productName}
            </DialogTitle>
          </DialogHeader>
          
          {reviewSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold">Thank You!</h3>
              <p className="text-slate-400">Your review has been submitted and is pending approval.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-300">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= reviewRating 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-slate-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Your Review</Label>
                <Textarea
                  placeholder="Tell us about your experience with this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setReviewDialogOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
