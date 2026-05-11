import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment_status');
    const orderNumber = params.get('order_number');
    
    console.log('Redirect page hit with:', { paymentStatus, orderNumber });
    
    // Redirect to appropriate page
    if (paymentStatus === 'COMPLETE' || paymentStatus === 'complete') {
      navigate(`/payfast/return?payment_status=processing&order_number=${orderNumber}`);
    } else if (paymentStatus === 'CANCELLED') {
      navigate('/payfast/cancel');
    } else {
      navigate('/orders');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default RedirectPage;