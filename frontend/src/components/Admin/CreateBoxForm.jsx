import React, { useState } from 'react';
import { Form, ProgressBar, Alert, Row, Col, Button as BsButton } from 'react-bootstrap';
import { FaCloudUploadAlt, FaPlus, FaTrash, FaBoxOpen, FaMagic, FaDollarSign } from 'react-icons/fa';
import api from '../../utils/api'; 
import '../../style/adminDashboard.css';

const CreateBoxForm = () => {
    // Box State
    const [boxName, setBoxName] = useState('');
    const [boxPrice, setBoxPrice] = useState('');
    const [boxImageFile, setBoxImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null);

    // Items State
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({ name: '', value: '', chance: '', imageFile: null });

    // Status State
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState(null);

    // --- HELPER: Upload Single Image (For Box Cover) ---
    const uploadImageForBox = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return `http://localhost:5000${res.data}`; 
    };

    const handleBoxImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBoxImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- HANDLERS ---
    const handleAddItem = () => {
        if (!currentItem.name || !currentItem.value || !currentItem.chance || !currentItem.imageFile) {
            alert("Please fill all item fields and select an image.");
            return;
        }
        setItems([...items, currentItem]);
        setCurrentItem({ name: '', value: '', chance: '', imageFile: null }); 
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // --- MAIN SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!boxImageFile) {
            alert("Please select a box cover image.");
            return;
        }

        setLoading(true);
        setMessage(null);
        setUploadProgress(0);

        try {
            // STEP 1: Upload Box Image first to get URL
            const boxImageUrl = await uploadImageForBox(boxImageFile);

            // STEP 2: Create the Box (Send JSON)
            const boxResponse = await api.post('/boxes', {
                title: boxName, // changed 'name' to 'title' to match your backend
                price: boxPrice,
                image: boxImageUrl
            });

            // --- FIX 1: Correctly get the ID ---
            const newBoxId = boxResponse.data.id; 
            if (!newBoxId) throw new Error("Failed to get Box ID from server");

            const totalSteps = items.length;
            
            // STEP 3: Upload Items
            for (let i = 0; i < totalSteps; i++) {
                const item = items[i];
                const itemData = new FormData();
                itemData.append('name', item.name);
                itemData.append('value', item.value);
                itemData.append('chance', item.chance);
                itemData.append('image', item.imageFile); // Send the Raw File!

                await api.post(`/boxes/${newBoxId}/items`, itemData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setUploadProgress(((i + 1) / totalSteps) * 100);
            }

            setMessage({ type: 'success', text: 'Box and all items published successfully!' });
            setBoxName(''); setBoxPrice(''); setItems([]); setBoxImageFile(null); setPreviewUrl(null);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'danger', text: error.response?.data?.error || 'Error creating box.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="premium-card">
            <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                    <FaBoxOpen className="text-primary fs-3" />
                </div>
                <div>
                    <h4 className="fw-bold text-white mb-0">Create Mystery Box</h4>
                    <small className="text-muted">Design a new box and add potential rewards.</small>
                </div>
            </div>
            
            {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="mb-4">{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                    {/* LEFT COLUMN: Box Details */}
                    <Col lg={4}>
                        <h6 className="premium-label mb-4 text-white text-uppercase ls-1"><span className="badge bg-primary me-2">1</span>Box Configuration</h6>
                        
                        <div className="mb-4">
                            <label className="premium-label"><FaMagic className="me-2 text-primary"/>Box Title</label>
                            <input 
                                className="premium-input" 
                                type="text" 
                                placeholder="e.g. Legendary Loot" 
                                value={boxName} 
                                onChange={e => setBoxName(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="premium-label"><FaDollarSign className="me-2 text-success"/>Price ($)</label>
                            <input 
                                className="premium-input" 
                                type="number" 
                                placeholder="0.00" 
                                value={boxPrice} 
                                onChange={e => setBoxPrice(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="mb-4">
                            <label className="premium-label"><FaCloudUploadAlt className="me-2 text-info"/>Box Cover Art</label>
                            <div className="file-upload-zone" onClick={() => document.getElementById('boxCoverUpload').click()}>
                                {previewUrl ? (
                                    <div className="position-relative">
                                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'contain' }} />
                                        <div className="mt-2 text-success small fw-bold">Image Selected</div>
                                    </div>
                                ) : (
                                    <div className="text-muted">
                                        <FaCloudUploadAlt className="fs-1 mb-2 text-primary opacity-50" />
                                        <p className="mb-0 small">Click or Drag to upload cover</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                id="boxCoverUpload"
                                type="file" 
                                className="d-none" 
                                onChange={handleBoxImageChange} 
                                accept="image/*"
                            />
                        </div>
                    </Col>

                    {/* RIGHT COLUMN: Items */}
                    <Col lg={8}>
                        <h6 className="premium-label mb-4 text-white text-uppercase ls-1"><span className="badge bg-success me-2">2</span>Box Contents (Items)</h6>
                        
                        <div className="p-4 mb-4 rounded" style={{ background: 'rgba(25, 28, 32, 0.6)', border: '1px border-secondary' }}>
                            <Row className="g-3 align-items-end">
                                <Col md={3}>
                                    <label className="premium-label tiny mb-2">Item Name</label>
                                    <input className="premium-input py-2" placeholder="e.g. iPhone 15" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                                </Col>
                                <Col md={2}>
                                    <label className="premium-label tiny mb-2">Value ($)</label>
                                    <input className="premium-input py-2" placeholder="0.00" type="number" value={currentItem.value} onChange={e => setCurrentItem({...currentItem, value: e.target.value})} />
                                </Col>
                                <Col md={2}>
                                    <label className="premium-label tiny mb-2">Chance (%)</label>
                                    <input className="premium-input py-2" placeholder="0-100" type="number" value={currentItem.chance} onChange={e => setCurrentItem({...currentItem, chance: e.target.value})} />
                                </Col>
                                <Col md={3}>
                                    <label className="premium-label tiny mb-2">Item Image</label>
                                    <input className="premium-input py-2 form-control-sm" type="file" onChange={e => setCurrentItem({...currentItem, imageFile: e.target.files[0]})} accept="image/*" />
                                </Col>
                                <Col md={2}>
                                    <BsButton variant="success" className="w-100 py-2 d-flex align-items-center justify-content-center fw-bold" onClick={handleAddItem} disabled={!currentItem.name}>
                                        <FaPlus className="me-1"/> Add
                                    </BsButton>
                                </Col>
                            </Row>
                        </div>

                        {/* Items List */}
                        <div className="table-responsive rounded border border-secondary" style={{ maxHeight: '450px', overflowY: 'auto', background: '#16191d' }}>
                            <table className="premium-table mb-0">
                                <thead className="sticky-top" style={{zIndex: 5}}>
                                    <tr>
                                        <th className="bg-dark text-white">Item Name</th>
                                        <th className="bg-dark text-white">Value</th>
                                        <th className="bg-dark text-white">Chance</th>
                                        <th className="bg-dark text-white">Image File</th>
                                        <th className="bg-dark text-white text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-5">
                                                <FaBoxOpen className="fs-1 mb-3 opacity-25"/>
                                                <p>No items added yet. Fill the form above to populate the box.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold text-white align-middle">{item.name}</td>
                                                <td className="text-success align-middle">${item.value}</td>
                                                <td className="align-middle"><span className="badge bg-secondary">{item.chance}%</span></td>
                                                <td className="align-middle" style={{maxWidth: '150px'}}>
                                                    <small className="text-info d-block text-truncate" title={item.imageFile ? item.imageFile.name : ''}>
                                                        {item.imageFile ? item.imageFile.name : <span className="text-muted">No file</span>}
                                                    </small>
                                                </td>
                                                <td className="text-end align-middle">
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>

                <hr className="border-secondary my-4" />

                {/* --- SUBMIT --- */}
                {loading && (
                    <div className="mb-3">
                        <small className="text-muted mb-1 d-block">Uploading... {Math.round(uploadProgress)}%</small>
                        <ProgressBar now={uploadProgress} variant="success" style={{ height: '6px' }} />
                    </div>
                )}
                
                <div className="text-end">
                    <button className="btn-premium-primary px-5 py-3" type="submit" disabled={loading || items.length === 0}>
                        {loading ? 'Processing...' : (
                            <>
                                <FaMagic className="me-2" /> Launch Mystery Box
                            </>
                        )}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default CreateBoxForm;