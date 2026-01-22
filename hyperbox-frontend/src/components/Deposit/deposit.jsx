import './deposit.css';
import visa from '../../assestes/deposit/visa.png';
import card from '../../assestes/deposit/card.png';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import Functions
import { getAuth } from 'firebase/auth'; // Import Auth

function Deposit() {
    // --- STATE & HOOKS ---
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    
    const functions = getFunctions();
    const auth = getAuth();

    const cards = [
        { id: 0, pic: visa },
        { id: 1, pic: card },
        { id: 2, pic: visa },
        { id: 3, pic: card },
        { id: 4, pic: visa }
    ];

    const handleIncrement = () => {
        setAmount((prev) => (parseInt(prev) || 0) + 1);
    };

    const handleDecrement = () => {
        if (amount > 0) {
            setAmount((prev) => (parseInt(prev) || 0) - 1);
        }
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue === '' || /^\d+$/.test(inputValue)) {
            setAmount(inputValue === '' ? '' : parseInt(inputValue));
        }
    };

    // --- SECURE DEPOSIT FUNCTION ---
    const handleCreditCardPayment = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("Please log in to deposit.");
            return;
        }

        const depositAmount = parseInt(amount);
        if (!depositAmount || depositAmount < 5) {
            alert("Minimum deposit is $5");
            return;
        }

        setLoading(true);

        try {
            // Call YOUR server
            const response = await fetch('http://localhost:5000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    amount: depositAmount,
                    userId: user.uid 
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Redirect user to Stripe
                window.location.href = data.url;
            } else {
                alert("Error creating payment session");
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="deposit_main">
                <div className="deposit_box double-border">

                    <div className='head_div'>
                        <h1 className='head d-head'>
                            Deposit Balance
                        </h1>
                        <p className='para'>
                            Enter an amount you want to deposit
                        </p>
                    </div>
                    <div className='input_main_div'>
                        <div className='dec_div'>
                            <button onClick={handleDecrement} className='dec'>-</button>
                        </div>
                        <div className="deposit-form-control">
                            <input
                                className="input inputz input-alt"
                                type="text"
                                value={amount}
                                onChange={handleInputChange}
                                placeholder='0'
                            />
                            <span className="input-border input-border-alt"></span>
                        </div>
                        <div >
                            <button onClick={handleIncrement} className='add'>+</button>
                        </div>
                    </div>
                    
                    <div className='payment_btns'>
                        {/* 1. CREDIT CARD BUTTON (Connected to Stripe) */}
                        <div className='div1'>
                            <button 
                                className='credit_card_btn' 
                                onClick={handleCreditCardPayment}
                                disabled={loading}
                                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                                <b>{loading ? 'PROCESSING...' : 'PAY WITH CREDIT CARD / SQUARE'}</b>
                            </button>
                        </div>

                        {/* 2. Placeholder Buttons (No Logic Yet) */}
                        <div className='div2'>
                            <button className='cash_app_btn'>
                                <span className="span-mother">
                                    <span>PAY</span><span> WITH</span><span>PAY</span><span>PAL</span>
                                </span>
                                <span className="span-mother2">
                                    <span>PAY</span><span> WITH</span><span>PAY</span><span>PAL</span>
                                </span>
                            </button>
                        </div>
                        <div className='div3'>
                            <button className='crypto'>Pay With Crypto  (10% Bonus)</button>
                        </div>
                    </div>

                    <div className='cards-payment'>
                        {cards.map((v, i) => {
                            return (
                                <div key={i}>
                                    <img src={v.pic} alt="" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Deposit;