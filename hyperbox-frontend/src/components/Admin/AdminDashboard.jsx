import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Card, Table, Form, Button, Image, Badge, Modal, InputGroup } from 'react-bootstrap';
import { getFirestore, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
    FaChartPie, FaBoxOpen, FaUsers, FaClipboardList, FaMoneyBillWave, 
    FaUserSlash, FaSignOutAlt, FaTrash, FaMapMarkerAlt, FaShippingFast, 
    FaGem, FaSearch, FaExclamationTriangle, FaBars, FaTimes 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CreateBoxForm from './CreateBoxForm';
import CustomPagination from '../../components/CustomPagination'; 
import api from '../../utils/api';
import '../../style/adminDashboard.css';

const AdminDashboard = () => {
    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();
    
    // --- DATA STATE ---
    const [stats, setStats] = useState({ users: 0, transactions: 0, boxes: 0 });
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]); 
    const [boxes, setBoxes] = useState([]);
    const [globalTx, setGlobalTx] = useState([]);
    const [globalInv, setGlobalInv] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- UI STATE ---
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // --- PAGINATION STATE ---
    const [userPage, setUserPage] = useState(1);
    const [txPage, setTxPage] = useState(1);
    const [invPage, setInvPage] = useState(1);
    const [delPage, setDelPage] = useState(1); 
    const [itemsPerPage] = useState(10); 

    // --- MODAL STATES ---
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [adjustAmount, setAdjustAmount] = useState('');

    const [showShipModal, setShowShipModal] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);

    const [showBoxDetailsModal, setShowBoxDetailsModal] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);
    const [boxItems, setBoxItems] = useState([]);

    // --- DELETE MODAL STATE ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({ type: null, id: null, name: '' });
    const [deleteReason, setDeleteReason] = useState(''); 

    // --- REAL-TIME LISTENERS ---
    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
            setStats(prev => ({ ...prev, users: snap.size }));
            setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error("Users listener error:", error));

        const unsubBoxes = onSnapshot(query(collection(db, "boxes"), orderBy("price", "asc")), (snap) => {
            setStats(prev => ({ ...prev, boxes: snap.size }));
            setBoxes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error("Boxes listener error:", error));

        const unsubDeleted = onSnapshot(query(collection(db, "deleted_users"), orderBy("createdAt", "desc")), (snap) => {
            setDeletedUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error("Deleted Users listener error:", error));

        // Limit the initial load for performance, could add pagination at query level later
        const unsubTx = onSnapshot(query(collection(db, "all_transactions"), orderBy("timestamp", "desc"), limit(100)), (snap) => {
            setStats(prev => ({ ...prev, transactions: snap.size })); // Note: this size is limited to 100 now for this view
            setGlobalTx(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Tx listener error:", error);
            // toast.error("Transaction sync halted (Check Indexes)");
        });

        const unsubInv = onSnapshot(query(collection(db, "all_inventory"), orderBy("openedAt", "desc"), limit(100)), (snap) => {
            setGlobalInv(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
                console.error("Inv listener error:", error);
                // toast.error("Inventory sync halted");
        });

        return () => { unsubUsers(); unsubBoxes(); unsubDeleted(); unsubTx(); unsubInv(); };
    }, [db]);

    useEffect(() => {
        if (!selectedBox) return;
        const itemsQuery = query(collection(db, "boxes", selectedBox.id, "items")); 
        const unsubBoxItems = onSnapshot(itemsQuery, (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => (b.value || 0) - (a.value || 0));
            setBoxItems(items);
        });
        return () => unsubBoxItems();
    }, [selectedBox, db]);

    // --- HELPERS ---
    const getPaginatedData = (data, page) => {
        const indexOfLast = page * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        return data.slice(indexOfFirst, indexOfLast);
    };

    const handleViewShipping = (item) => {
        if (item.shippingDetails) {
            setViewingItem(item);
            setShowShipModal(true);
        } else {
            toast.info("No shipping details found for this item.");
        }
    };

    const handleBoxClick = (box) => {
        setSelectedBox(box);
        setBoxItems([]); 
        setShowBoxDetailsModal(true);
    };

    const handleLogout = async () => { 
        await signOut(auth); 
        navigate('/login'); 
    };

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    // --- DELETE HANDLERS ---
    const initiateDeleteUser = (user) => {
        setDeleteData({ type: 'user', id: user.id, name: user.email });
        setDeleteReason('');
        setShowDeleteModal(true);
    };

    const initiateDeleteBox = (box) => {
        setDeleteData({ type: 'box', id: box.id, name: box.title });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteData.type === 'user') {
                if(!deleteReason) { toast.warn("Please provide a reason."); return; }
                await api.delete(`/users/${deleteData.id}`, { data: { reason: deleteReason } });
                toast.success("User archived successfully");
            } else if (deleteData.type === 'box') {
                await api.delete(`/boxes/${deleteData.id}`);
                toast.success("Box deleted successfully");
            }
            setShowDeleteModal(false);
            setDeleteData({ type: null, id: null, name: '' });
        } catch (error) {
            toast.error("Delete failed: " + error.message);
        }
    };

    const openBalanceModal = (user) => { setSelectedUser(user); setAdjustAmount(''); setShowBalanceModal(true); };
    
    const handleUpdateBalance = async () => {
        if(!selectedUser || !adjustAmount) return;
        try {
            await api.put(`/users/${selectedUser.id}/balance`, { amount: parseFloat(adjustAmount) });
            toast.success("Balance updated successfully");
            setShowBalanceModal(false);
        } catch (error) { toast.error("Failed to update balance."); }
    };

    const filteredUsers = users.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- CHARTS ---
    const pieData = [
        { name: 'Active Boxes', value: stats.boxes, color: '#10b981' },
        { name: 'Users', value: stats.users, color: '#3b82f6' },
        { name: 'Tx Logged', value: stats.transactions, color: '#f59e0b' },
    ];

    return (
        <div className="admin-layout">
            <ToastContainer theme="dark" position="top-right" />
            
            {/* Mobile Sidebar Overlay */}
            <div className={`sidebar-overlay ${showSidebar ? 'show' : ''}`} onClick={() => setShowSidebar(false)}></div>

            <Tab.Container id="admin-tabs" activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setShowSidebar(false); }}>
                
                {/* SIDEBAR */}
                <div className={`admin-sidebar ${showSidebar ? 'show' : ''}`}>
                    <div className="p-4 d-flex justify-content-between align-items-center mb-2">
                        <h4 className="text-white fw-bold m-0 d-flex align-items-center gap-2" style={{letterSpacing: '-0.5px'}}>
                             HyperAdmin <Badge bg="primary" style={{fontSize: '0.5em', verticalAlign: 'top'}}>PRO</Badge>
                        </h4>
                        <div className="d-md-none text-muted" onClick={toggleSidebar} style={{cursor:'pointer'}}><FaTimes size={20} /></div>
                    </div>
                    
                    <Nav variant="pills" className="flex-column gap-1 p-3 flex-grow-1">
                        <small className="text-muted text-uppercase fw-bold ps-3 mb-2" style={{fontSize:'0.7rem', letterSpacing:'1px'}}>Main Menu</small>
                        <Nav.Item><Nav.Link eventKey="dashboard"><FaChartPie /> Dashboard</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="boxes"><FaBoxOpen /> Manage Boxes</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="users"><FaUsers /> User Management</Nav.Link></Nav.Item>
                        
                        <div className="my-3 border-top border-secondary opacity-25"></div>
                        
                        <small className="text-muted text-uppercase fw-bold ps-3 mb-2" style={{fontSize:'0.7rem', letterSpacing:'1px'}}>Data & Logs</small>
                        <Nav.Item><Nav.Link eventKey="inventory"><FaClipboardList /> Live Inventory</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="transactions"><FaMoneyBillWave /> Transactions</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="deleted"><FaUserSlash /> Archived Users</Nav.Link></Nav.Item>
                    </Nav>
                    
                    <div className="p-3 mt-auto">
                        <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-3">
                            <small className="text-muted d-block mb-1">Logged in as Admin</small>
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-success rounded-circle" style={{width:8, height:8}}></div>
                                <small className="text-white fw-bold">Online</small>
                            </div>
                        </div>
                        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT Area */}
                <div className="content-area">
                    {/* Mobile Header */}
                    <div className="d-md-none d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                        <h5 className="m-0 text-white fw-bold">HyperBox Admin</h5>
                        <button className="btn btn-dark border-0 text-white" onClick={toggleSidebar}><FaBars size={20} /></button>
                    </div>

                    <Tab.Content>
                        {/* --- DASHBOARD OVERVIEW --- */}
                        <Tab.Pane eventKey="dashboard" className="animate-fade-in">
                            <h2 className="text-white fw-bold mb-1">Dashboard</h2>
                            <p className="text-muted mb-4">Welcome back, get an overview of your platform.</p>
                            
                            <Row className="g-3 mb-4">
                                <Col sm={12} md={4}>
                                    <div className="premium-card d-flex align-items-center mb-0 p-4">
                                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 display-6 text-primary"><FaUsers /></div>
                                        <div>
                                            <h6 className="text-muted text-uppercase small fw-bold mb-1">Total Users</h6>
                                            <h3 className="text-white m-0 fw-bold">{stats.users}</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={12} md={4}>
                                    <div className="premium-card d-flex align-items-center mb-0 p-4">
                                        <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3 display-6 text-success"><FaBoxOpen /></div>
                                        <div>
                                            <h6 className="text-muted text-uppercase small fw-bold mb-1">Active Boxes</h6>
                                            <h3 className="text-white m-0 fw-bold">{boxes.length}</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={12} md={4}>
                                    <div className="premium-card d-flex align-items-center mb-0 p-4">
                                        <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3 display-6 text-warning"><FaMoneyBillWave /></div>
                                        <div>
                                            <h6 className="text-muted text-uppercase small fw-bold mb-1">Transactions</h6>
                                            <h3 className="text-white m-0 fw-bold">{stats.transactions}</h3>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="g-4">
                                <Col lg={8}>
                                    <div className="premium-card h-100">
                                        <div className="premium-card-header">
                                            <span>Platform Distribution</span>
                                        </div>
                                        <div style={{ width: '100%', height: '300px' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
                                                    </Pie>
                                                    <Tooltip contentStyle={{background: '#181b21', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="d-flex justify-content-center flex-wrap gap-4 mt-3">
                                            {pieData.map((d) => (
                                                <div key={d.name} className="d-flex align-items-center gap-2">
                                                    <span style={{width:10, height:10, borderRadius:'50%', backgroundColor:d.color}}></span>
                                                    <span className="text-muted small fw-bold">{d.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                     <div className="premium-card h-100 d-flex flex-column justify-content-center align-items-center p-4 text-center bg-gradient-to-b from-dark to-black">
                                        <FaGem className="display-1 text-primary opacity-25 mb-4" />
                                        <h4 className="text-white fw-bold">Admin Controls</h4>
                                        <p className="text-muted small px-3">
                                            Manage your boxes, users, and inventory from the sidebar. 
                                            All actions are logged and secure.
                                        </p>
                                        <Button variant="outline-primary" className="mt-3 rounded-pill px-4" onClick={() => setActiveTab('boxes')}>
                                            Manage Boxes
                                        </Button>
                                     </div>
                                </Col>
                            </Row>
                        </Tab.Pane>

                        {/* --- MANAGE BOXES --- */}
                        <Tab.Pane eventKey="boxes" className="animate-fade-in">
                            <h2 className="text-white fw-bold mb-1">Mystery Boxes</h2>
                            <p className="text-muted mb-4">Create, edit, or remove mystery boxes.</p>
                            
                            <CreateBoxForm />
                            
                            <div className="premium-card mt-4">
                                <div className="premium-card-header">
                                    Active Boxes 
                                    <Badge bg="primary" pill>{boxes.length}</Badge>
                                </div>
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead><tr><th>Box</th><th>Details</th><th>Price</th><th className="text-end">Actions</th></tr></thead>
                                        <tbody>
                                            {boxes.map(box => (
                                                <tr key={box.id} onClick={() => handleBoxClick(box)} className="cursor-pointer">
                                                    <td style={{width: '60px'}}>
                                                        <Image src={box.image} rounded style={{ width: '40px', height: '40px', objectFit: 'contain' }} className="bg-dark p-1"/>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold text-white">{box.title}</div>
                                                        <small className="text-muted">ID: {box.id.substring(0,8)}...</small>
                                                    </td>
                                                    <td><span className="premium-badge success text-white border-0 py-1 px-2">${box.price}</span></td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-danger border-0" 
                                                            onClick={(e) => { e.stopPropagation(); initiateDeleteBox(box); }}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Tab.Pane>

                        {/* --- USERS --- */}
                        <Tab.Pane eventKey="users" className="animate-fade-in">
                             <h2 className="text-white fw-bold mb-1">User Management</h2>
                             <p className="text-muted mb-4">Manage user accounts, balances, and permissions.</p>

                            <div className="premium-card">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                                    <h5 className="m-0 text-white fw-bold">All Users</h5>
                                    <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
                                        <input 
                                            type="text" 
                                            className="premium-input px-10" 
                                            placeholder="Search email..." 
                                            onChange={e => setSearchTerm(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead><tr><th>User</th><th>Role</th><th>Balance</th><th className="text-end">Actions</th></tr></thead>
                                        <tbody>
                                            {getPaginatedData(filteredUsers, userPage).map(user => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="fw-bold text-white text-truncate" style={{maxWidth: '200px'}}>{user.email}</div>
                                                        {/* <small className="text-muted text-truncate d-block" style={{maxWidth: '150px'}}>{user.id}</small> */}
                                                    </td>
                                                    <td><span className={`premium-badge ${user.role === 'admin' ? 'danger' : 'secondary'}`}>{user.role || 'User'}</span></td>
                                                    <td className="fw-bold text-success">${user.balance?.toFixed(2) || '0.00'}</td>
                                                    <td className="text-end">
                                                        <button className="btn-premium-primary btn-sm me-2" onClick={() => openBalanceModal(user)}>Credits</button>
                                                        <button className="btn btn-sm btn-outline-danger border-0" onClick={() => initiateDeleteUser(user)}><FaTrash /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3">
                                    <CustomPagination itemsPerPage={itemsPerPage} totalItems={filteredUsers.length} currentPage={userPage} paginate={setUserPage} />
                                </div>
                            </div>
                        </Tab.Pane>

                        {/* --- ARCHIVED USERS --- */}
                        <Tab.Pane eventKey="deleted" className="animate-fade-in">
                            <h2 className="text-white fw-bold mb-4">Archived Users</h2>
                            <div className="premium-card">
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead><tr><th>Email</th><th>Reason</th><th>By</th><th>Date</th></tr></thead>
                                        <tbody>
                                            {getPaginatedData(deletedUsers, delPage).map((user, idx) => (
                                                <tr key={user.id || idx}>
                                                    <td className="text-white">{user.email}</td>
                                                    <td className="text-danger small fw-bold">{user.deleteReason}</td>
                                                    <td className="text-muted small">{user.deletedByAdmin}</td>
                                                    <td className="text-muted small">{user.deletedAt?.seconds ? new Date(user.deletedAt.seconds * 1000).toLocaleDateString() : ''}</td>
                                                </tr>
                                            ))}
                                            {deletedUsers.length === 0 && <tr><td colSpan="4" className="text-center p-4 text-muted">No archives found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                <CustomPagination itemsPerPage={itemsPerPage} totalItems={deletedUsers.length} currentPage={delPage} paginate={setDelPage} />
                            </div>
                        </Tab.Pane>

                        {/* --- INVENTORY --- */}
                        <Tab.Pane eventKey="inventory" className="animate-fade-in">
                             <h2 className="text-white fw-bold mb-4">Inventory Logs</h2>
                             <div className="premium-card">
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead><tr><th>Item</th><th>Owner</th><th>Value</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {getPaginatedData(globalInv, invPage).map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Image src={item.itemImage} className="rounded bg-dark p-1" style={{width:'30px', height:'30px', objectFit:'contain'}}/>
                                                            <span className="text-white small fw-bold text-truncate" style={{maxWidth:'150px'}}>{item.itemName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small text-truncate" style={{maxWidth:'150px'}}>{item.email}</td>
                                                    <td className="text-success small fw-bold">${item.itemValue}</td>
                                                    <td>
                                                        {item.status === 'requested' ? (
                                                            <Badge bg="warning" text="dark" className="cursor-pointer" onClick={() => handleViewShipping(item)}>SHIP</Badge>
                                                        ) : (
                                                            <span className={`premium-badge ${item.status === 'sold' ? 'secondary' : 'primary'}`}>{item.status}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <CustomPagination itemsPerPage={itemsPerPage} totalItems={globalInv.length} currentPage={invPage} paginate={setInvPage} />
                            </div>
                        </Tab.Pane>

                        {/* --- TRANSACTIONS --- */}
                         <Tab.Pane eventKey="transactions" className="animate-fade-in">
                            <h2 className="text-white fw-bold mb-4">Transaction History</h2>
                            <div className="premium-card">
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead><tr><th>Type</th><th>User</th><th>Desc</th><th>Amount</th><th>Date</th></tr></thead>
                                        <tbody>
                                            {getPaginatedData(globalTx, txPage).map(tx => (
                                                <tr key={tx.id}>
                                                    <td><span className="premium-badge secondary">{tx.type}</span></td>
                                                    <td className="text-white small">{tx.email}</td>
                                                    <td className="text-muted small text-truncate" style={{maxWidth:'200px'}}>{tx.description}</td>
                                                    <td className={`fw-bold ${tx.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        {tx.amount >= 0 ? '+' : ''}${tx.amount}
                                                    </td>
                                                    <td className="small text-muted">{tx.timestamp?.seconds ? new Date(tx.timestamp.seconds * 1000).toLocaleDateString() : ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <CustomPagination itemsPerPage={itemsPerPage} totalItems={globalTx.length} currentPage={txPage} paginate={setTxPage} />
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </div>

                {/* --- MODALS --- */}
                
                {/* Delete Confirmation */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="premium-modal border-danger" backdrop="static">
                    <Modal.Body className="text-center p-4">
                         <AnimatePresence>
                            {showDeleteModal && (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-25 text-danger" style={{width:'60px', height:'60px', fontSize:'1.5rem'}}>
                                        <FaExclamationTriangle />
                                    </div>
                                    <h4 className="text-white fw-bold mb-2">Confirm Deletion</h4>
                                    <p className="text-muted mb-4">
                                        Are you sure you want to delete <strong className="text-white">{deleteData.name}</strong>?
                                        This process cannot be undone.
                                    </p>
                                    
                                    {deleteData.type === 'user' && (
                                        <div className="text-start mb-4">
                                            <label className="text-muted small mb-2 fw-bold text-uppercase">Reason Required</label>
                                            <Form.Control as="textarea" rows={2} className="premium-input bg-dark border-secondary text-white" 
                                                placeholder="Enter reason for deletion..." value={deleteReason} onChange={e => setDeleteReason(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-center gap-3">
                                        <Button variant="outline-light" className="px-4 border-secondary text-muted" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                                        <Button variant="danger" className="px-4 fw-bold" onClick={confirmDelete}>Delete Permanently</Button>
                                    </div>
                                </motion.div>
                            )}
                         </AnimatePresence>
                    </Modal.Body>
                </Modal>

                {/* Credit Management */}
                <Modal show={showBalanceModal} onHide={() => setShowBalanceModal(false)} centered contentClassName="premium-modal">
                    <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25"><Modal.Title className="text-white fs-5">Manage Credits</Modal.Title></Modal.Header>
                    <Modal.Body className="p-4">
                        <p className="text-muted mb-3">Adjust balance for <span className="text-white fw-bold">{selectedUser?.email}</span></p>
                        <InputGroup>
                            <InputGroup.Text className="bg-dark text-secondary border-secondary">$</InputGroup.Text>
                            <input type="number" className="premium-input form-control" placeholder="Amount (e.g. 50 or -20)" 
                                value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)}
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer className="border-top border-secondary border-opacity-25 p-3">
                        <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowBalanceModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleUpdateBalance}>Update Balance</Button>
                    </Modal.Footer>
                </Modal>

                {/* Box Details */}
                 <Modal show={showBoxDetailsModal} onHide={() => setShowBoxDetailsModal(false)} size="lg" centered contentClassName="premium-modal">
                    <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25">
                        <Modal.Title className="text-white fs-5 d-flex align-items-center gap-2"><FaBoxOpen className="text-primary"/> Box Content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        {selectedBox && (
                            <div className="p-4">
                                <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                                    <div className="p-3 rounded-3 bg-dark d-flex align-items-center justify-content-center" style={{width:'100px', height:'100px'}}>
                                        <Image src={selectedBox.image} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-white mb-1">{selectedBox.title}</h3>
                                        <Badge bg="success" className="px-3 py-2 fs-6 mt-1">${selectedBox.price}</Badge>
                                    </div>
                                </div>
                                
                                <h6 className="text-muted text-uppercase fw-bold small mb-3">Items in this box</h6>
                                
                                {boxItems.length === 0 ? (
                                    <div className="text-center py-5 border border-dashed border-secondary rounded-3 opacity-50">
                                        <p className="text-muted m-0">No items found.</p>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {boxItems.map(item => (
                                            <div key={item.id} className="col-6 col-md-4 col-lg-3">
                                                <div className="bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-25 h-100 text-center">
                                                    <div style={{ height: '60px' }} className="d-flex align-items-center justify-content-center mb-2">
                                                        <Image src={item.image || item.itemImage} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                    <div className="text-white small fw-bold text-truncate mb-1">{item.name || item.itemName}</div>
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <span className="text-success fw-bold small">${item.value || item.itemValue}</span>
                                                        <Badge bg="secondary" className="text-dark bg-opacity-75" style={{fontSize:'0.6em'}}>{item.chance}%</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
                
                 {/* Shipping Modal */}
                 <Modal show={showShipModal} onHide={() => setShowShipModal(false)} centered contentClassName="premium-modal">
                    <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary border-opacity-25"><Modal.Title className="text-white fs-5">Shipping Request</Modal.Title></Modal.Header>
                    <Modal.Body className="text-white">
                        {viewingItem?.shippingDetails ? (
                            <div className="d-flex flex-column gap-2">
                                <p><strong className="text-muted">Name:</strong> {viewingItem.shippingDetails.fullName}</p>
                                <p><strong className="text-muted">Address:</strong> {viewingItem.shippingDetails.address}</p>
                                <p><strong className="text-muted">City/Zip:</strong> {viewingItem.shippingDetails.city}, {viewingItem.shippingDetails.zipCode}</p>
                                <p><strong className="text-muted">Country:</strong> {viewingItem.shippingDetails.country}</p>
                            </div>
                        ) : <p className="text-muted">No details available.</p>}
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-3">
                        <Button variant="success" className="w-100" onClick={() => {toast.success("Marked as Shipped (Demo)"); setShowShipModal(false);}}>Mark as Shipped</Button>
                    </Modal.Footer>
                </Modal>

            </Tab.Container>
        </div>
    );
};

export default AdminDashboard;