import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PayFastReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment_status');
    
    if (paymentStatus === 'COMPLETE') {
      navigate('/orders?payment=success');
    } else {
      navigate('/cart?payment=failed');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CircularProgress />
      <p className="ml-3">Processing payment...</p>
    </div>
  );
};

export default PayFastReturn;