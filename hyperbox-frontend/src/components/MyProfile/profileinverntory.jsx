import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Modal, Button, Form, Badge, Alert, Spinner } from "react-bootstrap";
import { FaBoxOpen, FaHistory, FaTruck, FaMoneyBillWave, FaCoins, FaCheckCircle, FaClock } from 'react-icons/fa'; // Icons
import api from "../../utils/api";
import "./profile.css";
import "./profileTabs.css"; // Newly added premium tabs styles

const ProfileInventory = () => {
    const auth = getAuth();
    const db = getFirestore();
    
    // --- STATE ---
    const [activeTab, setActiveTab] = useState("inventory");
    const [inventory, setInventory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- SHIPPING MODAL STATE ---
    const [showShipModal, setShowShipModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [shipForm, setShipForm] = useState({ fullName: "", address: "", city: "", country: "", postalCode: "" });
    const [actionLoading, setActionLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const qInventory = query(collection(db, "users", user.uid, "inventory"), orderBy("openedAt", "desc"));
        const unsubInv = onSnapshot(qInventory, (snapshot) => {
            setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const qHistory = query(collection(db, "users", user.uid, "transactions"), orderBy("timestamp", "desc"));
        const unsubTx = onSnapshot(qHistory, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubInv(); unsubTx(); };
    }, [auth, db]);

    // --- ACTIONS ---
    const handleSell = async (itemId, itemValue) => {
        if (!window.confirm(`Are you sure you want to SELL this item for $${itemValue}?`)) return;
        setActionLoading(true); setMsg(null);
        try {
            await api.post(`/game/inventory/${itemId}/sell`);
            setMsg({ type: "success", text: "Item sold successfully! Balance updated." });
        } catch (error) {
            setMsg({ type: "danger", text: error.response?.data?.error || "Sell failed" });
        } finally { setActionLoading(false); }
    };

    const handleShipSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await api.post(`/game/inventory/${selectedItem.id}/ship`, shipForm);
            setMsg({ type: "success", text: "Shipping request sent successfully!" });
            setShowShipModal(false);
            setShipForm({ fullName: "", address: "", city: "", country: "", postalCode: "" });
        } catch (error) {
            setMsg({ type: "danger", text: error.response?.data?.error || "Request failed" });
        } finally { setActionLoading(false); }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'held': return <Badge bg="success">In Inventory</Badge>;
            case 'sold': return <Badge bg="secondary">Sold</Badge>;
            case 'requested': return <Badge bg="warning" text="dark">Processing</Badge>;
            case 'shipped': return <Badge bg="primary">Shipped</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="profile-inventory-container mt-4">
            
            {/* --- TABS --- */}
            {/* --- PREMIUM TABS --- */}
            <div className="profile-tabs-container mb-4">
                <div 
                    className={`profile-tab ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <FaBoxOpen className="me-2" /> MY INVENTORY
                </div>
                <div 
                    className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => { console.log('History Clicked'); setActiveTab('history'); }}
                >
                    <FaHistory className="me-2" /> TRANSACTION HISTORY
                </div>
            </div>

            {msg && <Alert variant={msg.type} onClose={() => setMsg(null)} dismissible>{msg.text}</Alert>}

            {/* --- CONTENT --- */}
            {loading ? <div className="text-center text-white"><Spinner animation="border" /></div> : (
                <>
                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="row g-4">
                            {inventory.length === 0 && <p className="text-center text-muted">No items found. Go open some boxes!</p>}
                            
                            {inventory.map((item) => (
                                <div className="col-md-6 col-lg-4" key={item.id}>
                                    <div className="card h-100 bg-dark text-white border-secondary shadow-sm item-card-hover">
                                        <div className="card-body text-center">
                                            <div className="mb-3 d-flex align-items-center justify-content-center" style={{height: '120px'}}>
                                                <img src={item.itemImage} alt={item.itemName} style={{maxHeight:'100px', maxWidth:'100%', objectFit:'contain'}} />
                                            </div>
                                            <h5 className="card-title text-truncate" title={item.itemName}>{item.itemName}</h5>
                                            <p className="text-muted small mb-2">From: {item.boxName}</p>
                                            <h4 className="text-warning mb-3">${item.itemValue}</h4>
                                            <div className="mb-3">{getStatusBadge(item.status)}</div>

                                            {item.status === 'held' && (
                                                <div className="d-grid gap-2">
                                                    <button className="btn btn-success btn-sm d-flex align-items-center justify-content-center gap-2" 
                                                        onClick={() => handleSell(item.id, item.itemValue)} disabled={actionLoading}>
                                                        <FaMoneyBillWave /> Sell for ${item.itemValue}
                                                    </button>
                                                    <button className="btn btn-info btn-sm text-white d-flex align-items-center justify-content-center gap-2" 
                                                        onClick={() => {setSelectedItem(item); setShowShipModal(true); setMsg(null);}} disabled={actionLoading}>
                                                        <FaTruck /> Ship to Me
                                                    </button>
                                                </div>
                                            )}
                                            {item.status === 'sold' && <small className="text-muted d-flex align-items-center justify-content-center gap-1"><FaCoins /> Sold for Credit</small>}
                                            {item.status === 'requested' && <small className="text-muted d-flex align-items-center justify-content-center gap-1"><FaClock /> Waiting for Approval</small>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="table-responsive history-table-wrapper custom-scrollbar">
                            <table className="table table-dark table-hover align-middle custom-history-table mb-0">
                                <thead className="table-head-glow">
                                    <tr>
                                        <th style={{width: '20%'}}>Date</th>
                                        <th style={{width: '15%'}}>Type</th>
                                        <th style={{width: '45%'}}>Description</th>
                                        <th style={{width: '20%'}}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="history-row">
                                            <td className="text-muted">{new Date(tx.timestamp?.seconds * 1000).toLocaleDateString()} <small>{new Date(tx.timestamp?.seconds * 1000).toLocaleTimeString()}</small></td>
                                            <td>
                                                <Badge bg={tx.type === 'DEPOSIT' || tx.type === 'SELL_ITEM' ? 'success' : 'danger'} className="history-badge">
                                                    {tx.type}
                                                </Badge>
                                            </td>
                                            <td className="text-white-50">{tx.description}</td>
                                            <td className={tx.amount > 0 ? 'text-success fw-bold amount-cell' : 'text-danger fw-bold amount-cell'}>
                                                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted">No transactions found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* --- SHIPPING MODAL (Fixed Styling) --- */}
            <Modal show={showShipModal} onHide={() => setShowShipModal(false)} centered className="dark-modal">
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title><FaTruck className="me-2" />Shipping Request</Modal.Title>
                </Modal.Header>
                
                {/* FIX: Added 'text-start' to force left alignment override */}
                <Modal.Body className="bg-dark text-white text-start"> 
                    <p className="mb-3 style={{ color: '#ccc', textAlign: 'left' }}">Where should we send your <strong>{selectedItem?.itemName}</strong>?</p>
                    
                    <Form onSubmit={handleShipSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-white d-block">Full Name</Form.Label>
                            <Form.Control type="text" required className="bg-secondary text-white border-0"
                                value={shipForm.fullName} onChange={e => setShipForm({...shipForm, fullName: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-white d-block">Street Address</Form.Label>
                            <Form.Control type="text" required className="bg-secondary text-white border-0"
                                value={shipForm.address} onChange={e => setShipForm({...shipForm, address: e.target.value})} />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Form.Group className="mb-3 w-50">
                                <Form.Label className="text-white d-block">City</Form.Label>
                                <Form.Control type="text" required className="bg-secondary text-white border-0"
                                    value={shipForm.city} onChange={e => setShipForm({...shipForm, city: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3 w-50">
                                <Form.Label className="text-white d-block">Postal Code</Form.Label>
                                <Form.Control type="text" required className="bg-secondary text-white border-0"
                                    value={shipForm.postalCode} onChange={e => setShipForm({...shipForm, postalCode: e.target.value})} />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-4">
                            <Form.Label className="text-white d-block">Country</Form.Label>
                            <Form.Control type="text" required className="bg-secondary text-white border-0"
                                value={shipForm.country} onChange={e => setShipForm({...shipForm, country: e.target.value})} />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={actionLoading} className="fw-bold">
                                {actionLoading ? 'Sending Request...' : 'Confirm Shipping Details'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProfileInventory;