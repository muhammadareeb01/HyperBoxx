// const admin = require('firebase-admin');
// const db = admin.firestore();

// // --- 1. THE RNG ENGINE (Simple Weighted Random) ---
// const pickWinner = (items) => {
//     const totalChance = items.reduce((sum, item) => sum + (Number(item.chance) || 0), 0);
//     let random = Math.random() * totalChance;
    
//     for (const item of items) {
//         const chance = Number(item.chance) || 0;
//         if (random < chance) return item;
//         random -= chance;
//     }
//     return items[0];
// };

// // --- 2. THE OPEN BOX FUNCTION ---
// const openBox = async (req, res) => {
//     const { id: boxId } = req.params;
//     const { uid, email } = req.user; // We get 'email' from the token too!

//     try {
//         const result = await db.runTransaction(async (t) => {
//             // A. READ DATA
//             const userRef = db.collection('users').doc(uid);
//             const boxRef = db.collection('boxes').doc(boxId);
//             const itemsRef = boxRef.collection('items');

//             const userDoc = await t.get(userRef);
//             const boxDoc = await t.get(boxRef);
//             const itemsSnapshot = await t.get(itemsRef);

//             if (!boxDoc.exists) throw new Error("Box not found");
//             if (itemsSnapshot.empty) throw new Error("Box is empty (Maintenance Mode)");

//             const userData = userDoc.data();
//             const boxData = boxDoc.data();
//             const userBalance = Number(userData.balance) || 0;
//             const boxPrice = Number(boxData.price) || 0;

//             const safeBoxName = boxData.name || boxData.title || "Mystery Box";

//             // B. CHECK FUNDS
//             if (userBalance < boxPrice) {
//                 throw new Error("INSUFFICIENT_FUNDS");
//             }

//             // C. PICK WINNER
//             const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             const wonItem = pickWinner(items);

//             // D. CALCULATE NEW BALANCE
//             const newBalance = userBalance - boxPrice;

//             // --- E. PREPARE WRITES (Atomic Batch) ---

//             // 1. Deduct Balance (User)
//             t.update(userRef, { 
//                 balance: newBalance,
//                 nonce: admin.firestore.FieldValue.increment(1)
//             });

//             // 2. User Inventory (Private)
//             const inventoryRef = userRef.collection('inventory').doc(); // Auto-ID
//             const inventoryItem = {
//                 boxId: boxId,
//                 boxName: safeBoxName,
//                 itemId: wonItem.id,
//                 itemName: wonItem.name,
//                 itemValue: wonItem.value,
//                 itemImage: wonItem.image,
//                 status: 'held',
//                 openedAt: admin.firestore.FieldValue.serverTimestamp(),
//                 originalPrice: boxPrice
//             };
//             t.set(inventoryRef, inventoryItem);

//             // 3. User Transaction Log (Private)
//             const userTxRef = userRef.collection('transactions').doc();
//             const txData = {
//                 type: 'OPEN_BOX',
//                 amount: -boxPrice,
//                 description: `Opened ${safeBoxName}`,
//                 balanceAfter: newBalance,
//                 timestamp: admin.firestore.FieldValue.serverTimestamp(),
//                 relatedItemId: inventoryRef.id
//             };
//             t.set(userTxRef, txData);

//             // 4. GLOBAL Transaction Log (Admin View - Money Flow)
//             const globalTxRef = db.collection('all_transactions').doc(userTxRef.id);
//             t.set(globalTxRef, { 
//                 ...txData, 
//                 uid: uid, 
//                 email: email 
//             });

//             // 5. GLOBAL Inventory Log (Admin View - Item Flow) <--- NEW!
//             // We use the same ID as the user's inventory item for easy matching
//             const globalInvRef = db.collection('all_inventory').doc(inventoryRef.id);
//             t.set(globalInvRef, {
//                 ...inventoryItem,
//                 uid: uid,
//                 email: email
//             });

//             return { wonItem, newBalance };
//         });

//         // F. SUCCESS RESPONSE
//         res.status(200).json({ 
//             message: "Box opened!", 
//             item: result.wonItem, 
//             newBalance: result.newBalance 
//         });

//     } catch (error) {
//         if (error.message === "INSUFFICIENT_FUNDS") {
//             return res.status(400).json({ error: "Low Balance", code: "LOW_BALANCE" });
//         }
//         console.error("Open Box Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // --- 3. SELL ITEM (Cash Out) ---
// const sellItem = async (req, res) => {
//     const { itemId } = req.params;
//     const { uid, email } = req.user;

//     try {
//         await db.runTransaction(async (t) => {
//             // A. Reference Documents
//             const userRef = db.collection('users').doc(uid);
//             const itemRef = userRef.collection('inventory').doc(itemId);
//             const globalInvRef = db.collection('all_inventory').doc(itemId);

//             const userDoc = await t.get(userRef);
//             const itemDoc = await t.get(itemRef);

//             if (!itemDoc.exists) throw new Error("Item not found");
            
//             const itemData = itemDoc.data();
//             const userData = userDoc.data();
//             const currentBalance = Number(userData.balance) || 0;
//             const itemValue = Number(itemData.itemValue) || 0;

//             // B. Validation
//             if (itemData.status !== 'held') {
//                 throw new Error("Item cannot be sold (already sold or requested)");
//             }

//             // C. Calculations
//             const newBalance = currentBalance + itemValue;

//             // D. Writes
//             // 1. Update Balance
//             t.update(userRef, { balance: newBalance });

//             // 2. Update Item Status (User & Global)
//             t.update(itemRef, { status: 'sold', soldAt: admin.firestore.FieldValue.serverTimestamp() });
//             t.update(globalInvRef, { status: 'sold', soldAt: admin.firestore.FieldValue.serverTimestamp() });

//             // 3. Log Transaction (User)
//             const userTxRef = userRef.collection('transactions').doc();
//             const txData = {
//                 type: 'SELL_ITEM',
//                 amount: itemValue, // Positive amount
//                 description: `Sold ${itemData.itemName}`,
//                 balanceAfter: newBalance,
//                 timestamp: admin.firestore.FieldValue.serverTimestamp(),
//                 relatedItemId: itemId
//             };
//             t.set(userTxRef, txData);

//             // 4. Log Transaction (Global Admin)
//             const globalTxRef = db.collection('all_transactions').doc(userTxRef.id);
//             t.set(globalTxRef, { ...txData, uid, email });
//         });

//         res.status(200).json({ message: "Item sold successfully" });

//     } catch (error) {
//         console.error("Sell Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // --- 4. SHIP ITEM (Request Delivery) ---
// const shipItem = async (req, res) => {
//     const { itemId } = req.params;
//     const { uid, email } = req.user;
    
//     // Expecting full address from frontend form
//     const { fullName, address, city, country, postalCode } = req.body;

//     if (!address || !city || !country) {
//         return res.status(400).json({ error: "Missing shipping details" });
//     }

//     try {
//         await db.runTransaction(async (t) => {
//             const itemRef = db.collection('users').doc(uid).collection('inventory').doc(itemId);
//             const globalInvRef = db.collection('all_inventory').doc(itemId);

//             const itemDoc = await t.get(itemRef);
//             if (!itemDoc.exists) throw new Error("Item not found");
//             if (itemDoc.data().status !== 'held') throw new Error("Item unavailable for shipping");

//             const shippingData = {
//                 status: 'requested', // Admin will see this status
//                 shippingDetails: {
//                     fullName, address, city, country, postalCode,
//                     requestedAt: new Date().toISOString()
//                 }
//             };

//             // Update both User and Global inventory so Admin sees the request immediately
//             t.update(itemRef, shippingData);
//             t.update(globalInvRef, shippingData);
//         });

//         res.status(200).json({ message: "Shipping request received!" });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Don't forget to export them!
// module.exports = { openBox, sellItem, shipItem };


const admin = require('firebase-admin');
const db = admin.firestore();

// --- 1. THE RNG ENGINE (Simple Weighted Random) ---
const pickWinner = (items) => {
    const totalChance = items.reduce((sum, item) => sum + (Number(item.chance) || 0), 0);
    let random = Math.random() * totalChance;
    
    for (const item of items) {
        const chance = Number(item.chance) || 0;
        if (random < chance) return item;
        random -= chance;
    }
    return items[0];
};

// --- 2. THE OPEN BOX FUNCTION ---
const openBox = async (req, res) => {
    const { id: boxId } = req.params;
    const { uid, email } = req.user;

    try {
        const result = await db.runTransaction(async (t) => {
            // A. READ DATA
            const userRef = db.collection('users').doc(uid);
            const boxRef = db.collection('boxes').doc(boxId);
            const itemsRef = boxRef.collection('items');

            const userDoc = await t.get(userRef);
            const boxDoc = await t.get(boxRef);
            const itemsSnapshot = await t.get(itemsRef);

            if (!boxDoc.exists) throw new Error("Box not found");
            if (itemsSnapshot.empty) throw new Error("Box is empty (Maintenance Mode)");

            const userData = userDoc.data();
            const boxData = boxDoc.data();
            const userBalance = Number(userData.balance) || 0;
            const boxPrice = Number(boxData.price) || 0;

            const safeBoxName = boxData.name || boxData.title || "Mystery Box";

            // B. CHECK FUNDS
            if (userBalance < boxPrice) {
                throw new Error("INSUFFICIENT_FUNDS");
            }

            // C. PICK WINNER
            const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const wonItem = pickWinner(items);

            // D. CALCULATE NEW BALANCE
            const newBalance = userBalance - boxPrice;

            // --- E. PREPARE WRITES (Atomic Batch) ---

            // 1. Deduct Balance, Increment Nonce, AND Increment Lifetime Boxes (NEW!)
            t.update(userRef, { 
                balance: newBalance,
                nonce: admin.firestore.FieldValue.increment(1),
                lifetimeBoxesOpened: admin.firestore.FieldValue.increment(1) // <-- ADDED HERE
            });

            // 2. User Inventory (Private)
            const inventoryRef = userRef.collection('inventory').doc(); 
            const inventoryItem = {
                boxId: boxId,
                boxName: safeBoxName,
                itemId: wonItem.id,
                itemName: wonItem.name,
                itemValue: wonItem.value,
                itemImage: wonItem.image,
                status: 'held',
                openedAt: admin.firestore.FieldValue.serverTimestamp(),
                originalPrice: boxPrice
            };
            t.set(inventoryRef, inventoryItem);

            // 3. User Transaction Log (Private)
            const userTxRef = userRef.collection('transactions').doc();
            const txData = {
                type: 'OPEN_BOX',
                amount: -boxPrice,
                description: `Opened ${safeBoxName}`,
                balanceAfter: newBalance,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                relatedItemId: inventoryRef.id
            };
            t.set(userTxRef, txData);

            // 4. GLOBAL Transaction Log
            const globalTxRef = db.collection('all_transactions').doc(userTxRef.id);
            t.set(globalTxRef, { 
                ...txData, 
                uid: uid, 
                email: email 
            });

            // 5. GLOBAL Inventory Log 
            const globalInvRef = db.collection('all_inventory').doc(inventoryRef.id);
            t.set(globalInvRef, {
                ...inventoryItem,
                uid: uid,
                email: email
            });

            return { wonItem, newBalance };
        });

        // F. SUCCESS RESPONSE
        res.status(200).json({ 
            message: "Box opened!", 
            item: result.wonItem, 
            newBalance: result.newBalance 
        });

    } catch (error) {
        if (error.message === "INSUFFICIENT_FUNDS") {
            return res.status(400).json({ error: "Low Balance", code: "LOW_BALANCE" });
        }
        console.error("Open Box Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// --- 3. SELL ITEM (Cash Out) ---
const sellItem = async (req, res) => {
    const { itemId } = req.params;
    const { uid, email } = req.user;

    try {
        await db.runTransaction(async (t) => {
            const userRef = db.collection('users').doc(uid);
            const itemRef = userRef.collection('inventory').doc(itemId);
            const globalInvRef = db.collection('all_inventory').doc(itemId);

            const userDoc = await t.get(userRef);
            const itemDoc = await t.get(itemRef);

            if (!itemDoc.exists) throw new Error("Item not found");
            
            const itemData = itemDoc.data();
            const userData = userDoc.data();
            const currentBalance = Number(userData.balance) || 0;
            const itemValue = Number(itemData.itemValue) || 0;

            if (itemData.status !== 'held') {
                throw new Error("Item cannot be sold (already sold or requested)");
            }

            const newBalance = currentBalance + itemValue;

            t.update(userRef, { balance: newBalance });
            t.update(itemRef, { status: 'sold', soldAt: admin.firestore.FieldValue.serverTimestamp() });
            t.update(globalInvRef, { status: 'sold', soldAt: admin.firestore.FieldValue.serverTimestamp() });

            const userTxRef = userRef.collection('transactions').doc();
            const txData = {
                type: 'SELL_ITEM',
                amount: itemValue,
                description: `Sold ${itemData.itemName}`,
                balanceAfter: newBalance,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                relatedItemId: itemId
            };
            t.set(userTxRef, txData);

            const globalTxRef = db.collection('all_transactions').doc(userTxRef.id);
            t.set(globalTxRef, { ...txData, uid, email });
        });

        res.status(200).json({ message: "Item sold successfully" });

    } catch (error) {
        console.error("Sell Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// --- 4. SHIP ITEM (Request Delivery) ---
const shipItem = async (req, res) => {
    const { itemId } = req.params;
    const { uid, email } = req.user;
    
    const { fullName, address, city, country, postalCode } = req.body;

    if (!address || !city || !country) {
        return res.status(400).json({ error: "Missing shipping details" });
    }

    try {
        await db.runTransaction(async (t) => {
            const itemRef = db.collection('users').doc(uid).collection('inventory').doc(itemId);
            const globalInvRef = db.collection('all_inventory').doc(itemId);

            const itemDoc = await t.get(itemRef);
            if (!itemDoc.exists) throw new Error("Item not found");
            if (itemDoc.data().status !== 'held') throw new Error("Item unavailable for shipping");

            const shippingData = {
                status: 'requested', 
                shippingDetails: {
                    fullName, address, city, country, postalCode,
                    requestedAt: new Date().toISOString()
                }
            };

            t.update(itemRef, shippingData);
            t.update(globalInvRef, shippingData);
        });

        res.status(200).json({ message: "Shipping request received!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { openBox, sellItem, shipItem };